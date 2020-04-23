import Channel from "cs-channel";
import WebSocket from 'ws';
import guid from 'guid';

export default class ChatCenter {
  users: IUser[] = [];

  addUser(user: IUser) {
    if (!this.hasUser(user.id)) {
      this.users.push(user);
    }
  }

  getUser(id: string): IUser {
    return this.users.find(user => user.id === id);
  }

  getPlainUsers(): Partial<IUser>[] {
    return this.users.map(user => ({
      id: user.id,
      name: user.name
    }));
  }

  hasUser(id: string): boolean {
    return this.users.some(user => user.id === id);
  }

  removeUser(id: string) {
    this.users = this.users.filter(user => user.id !== id);
  }

  messageCenter: IChatMessageGroup[] = [];

  addMessage(content: string, sender: string, receiver: string) {
    let group = this.getMessage(sender, receiver);
    if (!group) {
      group = {
        pair: [sender, receiver]
      };
      this.updateMessage(sender, receiver, group);
    }
    if (!group.messages) {
      group.messages = [];
    }
    group.messages.push({
      id: guid.raw(),
      sender,
      receiver,
      content,
      timestamp: new Date().getTime()
    });
    
  }

  getMessage(sender: string, receiver: string) {
    return this.messageCenter.find(group => group && (group.pair[0] === sender && group.pair[1] === receiver)
    || (group.pair[1] === sender && group.pair[0] === receiver));
  }

  updateMessage(sender: string, receiver: string, message: IChatMessageGroup) {
    let flag = false;
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
}

export interface IUser {
  socket: WebSocket;
  name: string;
  id: string;
  timer: NodeJS.Timeout;
}

export interface IChatMessageGroup {
  pair: [string, string];
  unread?: boolean;
  messages?: IChatMessage[];
}

export interface IChatMessage {
  id: string;
  sender: string; // IUser.id
  receiver: string;
  timestamp: number;
  content: string;
}