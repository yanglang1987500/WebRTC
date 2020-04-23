import { IChatMessageGroup } from "server/chat";
import { Events, MediaChatStatus } from "@common/enums/base";
import { action, observable, runInAction } from "mobx";
import ChatCenterStore from "./chatCenter";
import { PeerConnection, UserMedia } from "../webrtc";
import { DEFAULT_ICE_SERVER } from "@common/enums/constant";

export default class VideoAudio {

  ws: WebSocket;
  chatCenter: ChatCenterStore;
  connection: PeerConnection;
  userMedia: UserMedia;

  @observable
  mediaChatStatus: MediaChatStatus = MediaChatStatus.None;

  @observable
  isVideo: boolean = false;

  @observable
  videoSupport: boolean = false;
  @observable
  audioSupport: boolean = false;

  @observable
  localMediaStream: MediaStream;
  @observable
  remoteMediaStream: MediaStream;

  constructor(ws: WebSocket, chatCenter: ChatCenterStore) {
    this.ws = ws;
    this.chatCenter = chatCenter;
    this.initListener();
    this.initMediaSupport();
  }

  initListener() {
    this.ws.addEventListener('message', event => {
      const message = JSON.parse(event.data as string) as IWebSocketMessage<IChatMessageGroup>;
      switch (message.event) {
        case Events.Call:
          this.onCall(message);
          break;
        case Events.Candidate:
          message.type === 'media' && this.onCandidate(message);
          break;
        case Events.Accept:
          this.onAccept(message);
          break;
        case Events.Offer:
          message.type === 'media' && this.onOffer(message);
          break;
        case Events.Answer:
          message.type === 'media' && this.onAnswer(message);
          break;
        case Events.Leave:
          this.onLeave();
          break;
        case Events.UnSupport:
          this.onUnSupport();
          break;
      }
    });
  }

  async initMediaSupport() {
    let [ audioSupport, videoSupport ] = [ false, false ];
    const mediaDeviceInfos = await navigator.mediaDevices.enumerateDevices();
    mediaDeviceInfos.forEach(mediaDevice => {
      if (mediaDevice.kind === 'audioinput' && audioSupport === false) {
        audioSupport = true;
      }
      if (mediaDevice.kind === 'videoinput' && videoSupport === false) {
        videoSupport = true;
      }
    });
    runInAction(() => {
      this.audioSupport = audioSupport;
      this.videoSupport = videoSupport;
    });
  }

  @action
  async call(video: boolean) {
    try {
      await this.openLocalStream(video);
      this.setMediaStatus(MediaChatStatus.CallOut);
      this.createConnection();
      this.chatCenter.sendEvent(Events.Call, { isVideo: video });
    } catch (e) {
      console.log(e);
      window.promptManager.show({
        title: "错误",
        message: e.message
      });
    }
  }
  
  async accept() {
    if (this.mediaChatStatus === MediaChatStatus.None) return;
    await this.openLocalStream(this.isVideo);
    this.chatCenter.sendEvent(Events.Accept, { accept: true });
  }

  @action
  reject() {
    if (this.mediaChatStatus === MediaChatStatus.None) return;
    this.isVideo = false;
    this.setMediaStatus(MediaChatStatus.None);
    this.chatCenter.sendEvent(Events.Accept, { accept: false });
  }

  @action
  leave() {
    if (this.mediaChatStatus === MediaChatStatus.None) return;
    this.chatCenter.sendEvent(Events.Leave);
    this.onLeave();
  }

  @action
  onLeave() {
    window.promptManager.show({
      title: '提示',
      message: '通话已结束'
    });
    this.resetConnect();
  }

  @action
  onCall(message: IWebSocketMessage) {
    if ((message.isVideo && !this.videoSupport) || (!message.isVideo && !this.audioSupport)) {
      this.chatCenter.sendEvent(Events.UnSupport);
      return;
    }
    this.chatCenter.setActiveUser(message.id);
    this.isVideo = message.isVideo;
    this.mediaChatStatus = MediaChatStatus.CallIn;
  }

  @action
  onUnSupport() {
    window.promptManager.show({
      title: "提示",
      message: `对方设备不支持${this.isVideo ? '视频': '语音'}通话`
    });
    this.resetConnect();
    return;
  }

  async onAccept(message: IWebSocketMessage) {
    if (!message.accept) {
      window.promptManager.show({
        title: "提示",
        message: "对方已拒绝……"
      });
      this.resetConnect();
      return;
    }
    try {
      const offer = await this.connection.createOffer();
      this.chatCenter.sendEvent(Events.Offer, { offer }, null, 'media');
    } catch (e) {
      console.log(e);
      window.promptManager.show({
        title: "错误",
        message: "创建offer异常"
      });
      this.resetConnect();
    }
  }

  async onOffer(message: IWebSocketMessage) {
    if (this.mediaChatStatus === MediaChatStatus.None) return;
    this.createConnection();
    this.connection.setRemoteSDP(new RTCSessionDescription(message.offer));
    try {
      const answer = await this.connection.createAnswer();
      this.chatCenter.sendEvent(Events.Answer, { answer }, null, 'media');
      this.setMediaStatus(MediaChatStatus.Chatting);
    } catch (e) {
      console.log(e);
      window.promptManager.show({
        title: "错误",
        message: "创建answer异常"
      });
    }
  }

  async onAnswer(message: IWebSocketMessage) {
    if (this.mediaChatStatus === MediaChatStatus.None) return;
    this.connection.setRemoteSDP(new RTCSessionDescription(message.answer));
    this.setMediaStatus(MediaChatStatus.Chatting);
  }

  onCandidate(message: IWebSocketMessage) {
    if (this.mediaChatStatus === MediaChatStatus.None) return;
    this.connection.setRemoteCandidate(new RTCIceCandidate(message.candidate));
  }

  @action
  resetConnect() {
    this.isVideo = false;
    this.setMediaStatus(MediaChatStatus.None);
    this.userMedia && this.userMedia.dispose();
    if (this.connection) {
      this.connection.dispose();
      this.connection = null;
    }
    this.localMediaStream = null;
    this.remoteMediaStream = null;
  }
  
  createConnection() {
    const connection = new PeerConnection();
    this.connection = connection;
    this.connection.ontrack = event => {
      runInAction(() => {
        this.remoteMediaStream = event.streams[0];
      });
    };
    this.connection.onicecandidate = candidate => this.chatCenter.sendEvent(Events.Candidate, { candidate }, null, 'media');
    connection.initialize();
    this.connection.attachStream(this.localMediaStream);
  }

  async openLocalStream(video: boolean) {
    const userMedia = new UserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: false
      }, video
    });
    this.userMedia = userMedia;
    try {
      const stream = await this.userMedia.initialize();
      this.setMediaStream(stream, video);
    } catch (e) {
      console.log(e);
      window.promptManager.show({
        title: "错误",
        message: e.message
      });
    }
  }

  @action
  setMediaStatus(mediaChatStatus: MediaChatStatus) {
    this.mediaChatStatus = mediaChatStatus;
  }

  @action
  setMediaStream(stream: MediaStream, isVideo: boolean) {
    this.localMediaStream = stream;
    this.isVideo = isVideo;
  }

}