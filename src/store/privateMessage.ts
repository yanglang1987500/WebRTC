import ChatCenterStore from "./chatCenter";

import { PeerConnection, DataChannel } from "../webrtc";
import { IChatMessageGroup } from "../../server/chat";
import { Events } from "@common/enums/base";
import { action, observable } from "mobx";

export default class PrivateMessage {

  ws: WebSocket;
  chatCenter: ChatCenterStore;
  connection: PeerConnection;
  channel: DataChannel;
  @observable
  privateMessage: boolean;
  to: string;

  constructor(ws: WebSocket, chatCenter: ChatCenterStore, to: string) {
    this.ws = ws;
    this.to = to;
    this.chatCenter = chatCenter;
    this.initListener();
  }

  initListener() {
    this.ws.addEventListener('message', this.wsListener);
  }

  wsListener = (event: MessageEvent) => {
    const message = JSON.parse(event.data as string) as IWebSocketMessage<IChatMessageGroup>;
    if (message.id !== this.to) return;
    switch (message.event) {
      case Events.StartPrivateMessage:
        this.onStartPrivateMessage();
        break;
      case Events.Candidate:
        message.type === 'message' && this.onCandidate(message);
        break; 
      case Events.Offer:
        message.type === 'message' && this.onOffer(message);
        break;
      case Events.Answer:
        message.type === 'message' && this.onAnswer(message);
        break;
      case Events.EndPrivateMessage:
        this.onEndPrivateMessage();
        break;
    }
  }

  @action
  async startPrivateMessage() {
    this.privateMessage = true;
    this.createConnection();
    this.channel = new DataChannel(this.connection, 'privateMessage', null);
    this.channel.initialize();
    this.channel.onmessage = this.receivePrivateMessage;
    this.chatCenter.sendEvent(Events.StartPrivateMessage, null, this.to);
    const offer = await this.connection.createOffer();
    this.chatCenter.sendEvent(Events.Offer, { offer }, this.to, 'message');
  }

  @action
  endPrivateMessage() {
    this.privateMessage = false;
    this.resetConnect();
    this.chatCenter.sendEvent(Events.EndPrivateMessage, null, this.to);
  }

  @action
  async onStartPrivateMessage() {
    this.privateMessage = true;
    this.createConnection();
  }

  @action
  onEndPrivateMessage() {
    this.privateMessage = false;
    this.resetConnect();
  }

  onCandidate(message: IWebSocketMessage) {
    if (!this.privateMessage) return;
    this.connection.setRemoteCandidate(new RTCIceCandidate(message.candidate));
  }
  
  async onOffer(message: IWebSocketMessage) {
    if (!this.privateMessage) return;
    this.connection.setRemoteSDP(new RTCSessionDescription(message.offer));
    try {
      const answer = await this.connection.createAnswer();
      this.chatCenter.sendEvent(Events.Answer, { answer }, this.to, 'message');
    } catch (e) {
      window.promptManager.show({
        title: "错误",
        message: "创建answer异常"
      });
    }
  }
  
  async onAnswer(message: IWebSocketMessage) {
    if (!this.privateMessage) return;
    this.connection.setRemoteSDP(new RTCSessionDescription(message.answer));
  }

  @action
  resetConnect() {
    if (this.connection) {
      this.connection.dispose();
      this.channel.dispose();
      this.channel = null;
      this.connection = null;
    }
  }
  
  createConnection() {
    const connection = new PeerConnection();
    this.connection = connection;

    this.connection.ondatachannel = channel => {
      this.channel = channel;
      channel.onmessage = this.receivePrivateMessage;
    };
   
    this.connection.onicecandidate = candidate => {
      this.chatCenter.sendEvent(Events.Candidate, { candidate }, this.to, 'message')
    };
    connection.initialize();
  }

  receivePrivateMessage = (event: MessageEvent, data: any) => {
    const v = JSON.parse(data);
    window.promptManager.show({
      title: `来自${this.chatCenter.getUserById(v.from).name}的私密消息`,
      message: v.message,
      duration: 5000
    });
  }

  sendPrivateMessage(content: string) {
    if (!this.privateMessage) return;
    this.channel && this.channel.sendMessage({ from: this.chatCenter.id, message: content });
  }

  dispose() {
    if (this.privateMessage) {
      this.chatCenter.sendEvent(Events.EndPrivateMessage, null, this.to);
      this.privateMessage = false;
      this.resetConnect();
      this.ws.removeEventListener('message', this.wsListener);
    }
  }
}