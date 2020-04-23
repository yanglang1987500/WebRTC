import ChatCenterStore from "./chatCenter";

import { PeerConnection, DataChannel } from "../webrtc";
import { IChatMessageGroup } from "../../server/chat";
import { Events, ITransferFile, TransferStatus } from "@common/enums/base";
import { action, observable, runInAction } from "mobx";
import guid from "guid";
import { file } from "@babel/types";

export default class FileTransfer {

  ws: WebSocket;
  chatCenter: ChatCenterStore;
  connection: PeerConnection;
  channel: DataChannel;
  to: string;
  @observable
  sendFileQueue: ITransferFile[] = [];
  @observable
  receiveFileQueue: ITransferFile[] = [];

  constructor(ws: WebSocket, chatCenter: ChatCenterStore, to: string) {
    this.ws = ws;
    this.to = to;
    this.chatCenter = chatCenter;
    this.initListener();
    this.createConnection();
    this.createChannel();
  }

  initListener() {
    this.ws.addEventListener('message', this.wsListener);
  }

  wsListener = (event: MessageEvent) => {
    const message = JSON.parse(event.data as string) as IWebSocketMessage<IChatMessageGroup>;
    if (message.id !== this.to) return;
    switch (message.event) {
      case Events.SendFile:
        this.onSendFile(message);
        break;
      case Events.AcceptFile:
        this.onAcceptFile(message);
        break;
      case Events.Candidate:
        message.type === 'file' && this.onCandidate(message);
        break; 
      case Events.Offer:
        message.type === 'file' && this.onOffer(message);
        break;
      case Events.Answer:
        message.type === 'file' && this.onAnswer(message);
        break;
    }
  }

  @action
  async sendFile(file: File) {
    const transferFile = {
      file,
      name: file.name,
      totalSize: file.size,
      transferedSize: 0,
      id: guid.raw().substr(0, 8),
      progress: 0,
      status: TransferStatus.Wait
    };
    this.sendFileQueue.push(transferFile);
    this.chatCenter.sendEvent(Events.SendFile, {
      fileId: transferFile.id,
      fileName: transferFile.name,
      totalSize: transferFile.totalSize
    }, this.to);
  }

  @action
  acceptFile(fileId: string, accept: boolean) {
    if (!accept) {
      this.receiveFileQueue = this.receiveFileQueue.filter(f => f.id !== fileId);
    }
    this.chatCenter.sendEvent(Events.AcceptFile, {
      fileId,
      accept,
    }, this.to);
  }

  @action
  async onSendFile(message: IWebSocketMessage) {
    if (this.to !== this.chatCenter.chatUserId) {
      this.chatCenter.setUnread(this.to, true);
    }
    this.receiveFileQueue.push({
      id: message.fileId,
      name: message.fileName,
      totalSize: message.totalSize,
      transferedSize: 0,
      data: [],
      status: TransferStatus.Wait
    });
    this.createConnection();
  }

  exchange: boolean = false;

  @action
  async onAcceptFile(message: IWebSocketMessage) {
    if (!message.accept) {
      window.promptManager.show({
        title: `提示`,
        message: `对方已拒绝接收文件《${this.sendFileQueue.find(f => f.id === message.fileId).name}》`,
        duration: 3000
      });
      this.sendFileQueue = this.sendFileQueue.filter(f => f.id !== message.fileId);
      return;
    }
    if (!this.exchange) {
      const offer = await this.connection.createOffer();
      this.chatCenter.sendEvent(Events.Offer, { offer }, this.to, 'file');
      this.exchange = true;
    }
    
    await this.doSendFile(message.fileId);
  }

  onCandidate(message: IWebSocketMessage) {
    this.connection.setRemoteCandidate(new RTCIceCandidate(message.candidate));
  }
  
  async onOffer(message: IWebSocketMessage) {
    this.connection.setRemoteSDP(new RTCSessionDescription(message.offer));
    try {
      const answer = await this.connection.createAnswer();
      this.chatCenter.sendEvent(Events.Answer, { answer }, this.to, 'file');
    } catch (e) {
      window.promptManager.show({
        title: "错误",
        message: "创建answer异常"
      });
    }
  }
  
  async onAnswer(message: IWebSocketMessage) {
    this.connection.setRemoteSDP(new RTCSessionDescription(message.answer));
  }

  @action
  resetConnect() {
    if (this.connection) {
      this.connection.dispose();
      this.connection = null;
    }
    if (this.channel) {
      this.channel.dispose();
      this.channel = null;
    }
  }
  
  createConnection() {
    const connection = new PeerConnection();
    this.connection = connection;

    this.connection.ondatachannel = channel => {
      this.channel = channel;
      channel.onmessage = this.receiveFile;
    };
   
    this.connection.onicecandidate = candidate => {
      this.chatCenter.sendEvent(Events.Candidate, { candidate }, this.to, 'file')
    };
    connection.initialize();
  }

  createChannel() {
    this.channel = new DataChannel(this.connection, 'file', null);
    this.channel.initialize();
    this.channel.onmessage = this.receiveFile;
  }

  @action
  receiveFile = (event: MessageEvent, raw: string) => {
    const result = JSON.parse(raw) as { fileId: string, data: string };
    const { fileId, data } = result;
    const buffer = string2ArrayBuffer(data);
    const transfer = this.receiveFileQueue.find(f => f.id === fileId);
    transfer.status = TransferStatus.Transfering;
    transfer.data.push(buffer);
    transfer.transferedSize += buffer.byteLength;
    transfer.progress = transfer.transferedSize / transfer.totalSize;
    if (transfer.transferedSize === transfer.totalSize) {
      transfer.status = TransferStatus.Complete;
    }
  }

  @action
  doSendFile(fileId: string) {
    return new Promise(resolve => {
      setTimeout(() => {
        const transfer = this.sendFileQueue.find(f => f.id === fileId);
        if (!transfer) {
          console.log(`${fileId} not exist`);
          return; 
        }
        runInAction(() => {
          transfer.status = TransferStatus.Transfering;
        });
        const fileReader = new FileReader();
        let currentChunk = 0;
        const readNextChunk = () => {
          const start = chunkLength * currentChunk;
          const end = Math.min(transfer.totalSize, start + chunkLength);
          fileReader.readAsArrayBuffer(transfer.file.slice(start, end));
        };
        fileReader.onload = () => {
          const raw = fileReader.result as ArrayBuffer;
          runInAction(() => {
            transfer.transferedSize += raw.byteLength;
            transfer.progress = transfer.transferedSize / transfer.totalSize;
          });
          
          this.channel.sendMessage({
            fileId,
            data: arrayBuffer2String(raw)
          });
          currentChunk++;
          if(chunkLength * currentChunk < transfer.totalSize) {
            readNextChunk();
          } else {
            runInAction(() => {
              transfer.status = TransferStatus.Complete;
            });
            resolve();
          };
        };
        readNextChunk();
      }, 100);
    });
    
  }

  downloadFile(fileId: string) {
    const transfer = this.receiveFileQueue.find(f => f.id === fileId);
    const blob = new Blob(transfer.data);
    this.chatCenter.download(URL.createObjectURL(blob), transfer.name);
  }
  
  @action
  deleteFile(fileId: string) {
    this.receiveFileQueue = this.receiveFileQueue.filter(f => f.id !== fileId); 
  }

  @action
  clearSendFile(fileId: string) {
    this.sendFileQueue = this.sendFileQueue.filter(f => f.id !== fileId); 
  }

  dispose() {
    this.resetConnect();
    this.ws.removeEventListener('message', this.wsListener);
  }
}

const chunkLength = 1024;

function arrayBuffer2String(ab: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(ab));
}

function string2ArrayBuffer(str: string) {
  const buf = new ArrayBuffer(str.length); // 2 bytes for each char
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}