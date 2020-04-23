import { observable, action, runInAction, toJS, reaction } from "mobx";
import { IChatMessageGroup } from "server/chat";
import { xorWith } from 'lodash-es';
import { Localstorage } from "@common/utils/storage";
import { CHAT_GUID_KEY } from "@common/enums/constant";
import { Events } from "@common/enums/base";
import VideoAudio from "./videoAudio";
import PrivateMessage from "./privateMessage";
import FileTransfer from "./fileTransfer";

export default class ChatCenterStore {
  ws: WebSocket;
  videoAudio: VideoAudio;
  privateMessageList: PrivateMessage[] = [];
  fileTransferList: FileTransfer[] = [];

  @observable
  wsready: boolean = false;

  @observable
  id: string = '';

  @observable
  users: IUser[] = [];

  @observable
  chatUserId: string = null;

  @observable
  messageCenter: IChatMessageGroup[] = [];

  constructor() {
    const ws = new WebSocket(`wss://${location.host.split(':')[0]}/chatserver`);
    this.ws = ws;
    ws.onclose = e => console.log('websocket close, code: ', e.code, e);
    ws.onopen = async (e) => {
      this.setWSReady();
      this.initSubStore();
      ws.addEventListener('message', event => {
        const message = JSON.parse(event.data as string) as IWebSocketMessage<IChatMessageGroup>;
        switch (message.event) {
          case Events.Join:
            this.setId(message.id);
            location.href = '#/';
            break;
          case Events.RefreshUsers:
            runInAction(() => {
              if (message && message.users) {
                const withoutself = message.users.filter(i => i.id !== this.id);
                this.refreshPrivateMessageList((toJS(this.users)).filter(i => i.id !== this.id), withoutself);
                this.refreshFileTransferList((toJS(this.users)).filter(i => i.id !== this.id), withoutself);
                this.users = message.users;
                if (message.users.every(i => i.id !== this.chatUserId)) {
                  this.chatUserId = withoutself.length > 0 ? withoutself[0].id : null;
                }
              }
            });
            break;
          case Events.RefreshMessages:
            runInAction(() => {
              message.messages && this.updateMessage(message.sender, message.receiver, message.messages);
            });
            break;
          case Events.Error:
            this.clearId();
            location.href = '#/login';
            break;
        }
      });
      this.fetchUsers();
    };
    reaction(
      () => this.chatUserId,
      (chatUserId: string) => {
        this.fetchMessages();
        this.setUnread(chatUserId, false);
      }
    );
  }

  setUnread(userId: string, unread: boolean) {
    const message = this.messageCenter.find(group => (group.pair[0] === userId || group.pair[1] === userId));
    message && (message.unread = unread);
  }

  logout() {
    this.sendEvent(Events.Logout);
    this.clearId();
    location.href = '#/login';
  }

  initSubStore() {
    this.videoAudio = new VideoAudio(this.ws, this);
  }

  @action
  refreshPrivateMessageList(previousUsers: IUser[], nextUsers: IUser[]) {
    const xorUsers = xorWith(previousUsers, nextUsers, (a, b) => a.id === b.id);
    xorUsers.forEach(user => {
      const p = this.privateMessageList.find(privateMessage => privateMessage.to === user.id);
      if (p) {
        p.dispose();
        this.privateMessageList = this.privateMessageList.filter(p => p.to !== user.id);
      } else {
        this.privateMessageList.push(new PrivateMessage(this.ws, this, user.id));
      }
    });
  }

  @action
  refreshFileTransferList(previousUsers: IUser[], nextUsers: IUser[]) {
    const xorUsers = xorWith(previousUsers, nextUsers, (a, b) => a.id === b.id);
    xorUsers.forEach(user => {
      const p = this.fileTransferList.find(fileTransfer => fileTransfer.to === user.id);
      if (p) {
        p.dispose();
        this.fileTransferList = this.fileTransferList.filter(p => p.to !== user.id);
      } else {
        this.fileTransferList.push(new FileTransfer(this.ws, this, user.id));
      }
    });
  }

  @action
  setWSReady() {
    this.wsready = true;
  }

  getMessage(sender: string, receiver: string) {
    return toJS(this.messageCenter).find(group => (group.pair[0] === sender && group.pair[1] === receiver)
      || (group.pair[1] === sender && group.pair[0] === receiver));
  }

  getUserById(id: string) {
    return this.users.find(user => user.id === id);
  }
  
  @action
  updateMessage(sender: string, receiver: string, message: IChatMessageGroup) {
    let flag = false;
    if (sender !== this.chatUserId && receiver !== this.chatUserId) {
      message.unread = true;
    } else {
      message.unread = false;
    }
    this.messageCenter = this.messageCenter.map(group => {
      if ((group.pair[0] === sender && group.pair[1] === receiver)
        || (group.pair[1] === sender && group.pair[0] === receiver)) {
        flag = true;
        return message;
      }
      return group;
    });
    if (!flag) {
      this.messageCenter.push(message);
    }
  }

  @action
  setId(id: string) {
    this.id = id;
    Localstorage.write(CHAT_GUID_KEY, id);
  }

  @action
  clearId() {
    this.id = null;
    Localstorage.remove(CHAT_GUID_KEY);
  }

  fetchUsers() {
    this.wsready && this.id && this.sendEvent(Events.RefreshUsers, { id: this.id });
  }

  fetchMessages() {
    this.wsready && this.id && this.chatUserId && this.sendEvent(Events.RefreshMessages, { id: this.id, to: this.chatUserId });
  }

  
  @action
  async join(name: string, id?: string) {
    this.sendEvent(Events.Join, { name, id });
  }

  @action
  setActiveUser(id: string) {
    this.chatUserId = id;
  }

  sendEvent(event: string, data?: IKeyValueMap, to?: string, type?: rtcType) {
    this.ws.send(JSON.stringify({
      event,
      to: to || this.chatUserId,
      id: this.id,
      ...data,
      type,
    }));
  }

  sendMessage(content: string, to: string) {
    this.sendEvent(Events.Message, { content, to });
  }

  download(url: string, filename: string) {
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
}