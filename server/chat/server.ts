import ChatCenter, { IUser } from ".";
import WebSocket from 'ws';
import { IKeyValueMap } from "cs-channel/lib/type";
import { IWebSocketMessage } from "../interface";
import onJoin from "./message/onJoin";
import { Events } from "../../src/common/enums/base";

export default (socket: WebSocket, chatCenter: ChatCenter) => {
  let user: IUser = null;
  socket.on('close', () => {
    if (user) {
      user.timer = setTimeout(() => {
        console.log('clear user: ', user.id);
        chatCenter.removeUser(user.id);
        self.broadcast(_socket => sendMessage(Events.RefreshUsers, {
          users: chatCenter.getPlainUsers()
        }, _socket));
      }, 10000);
    }
  });
  const self = {

    onJoin(message: IWebSocketMessage) {
      user = onJoin(socket, chatCenter, message);
      sendMessage(Events.Join, {
        id: user.id
      });
      self.broadcast(_socket => sendMessage(Events.RefreshUsers, {
        users: chatCenter.getPlainUsers()
      }, _socket));
    },

    onLogout(message: IWebSocketMessage) {
      chatCenter.removeUser(message.id);
      self.broadcast(_socket => sendMessage(Events.RefreshUsers, {
        users: chatCenter.getPlainUsers()
      }, _socket));
    },

    onRefreshUsers() {
      sendMessage(Events.RefreshUsers, {
        users: chatCenter.getPlainUsers
      });
    },

    onRefreshMessages(message: IWebSocketMessage) {
      const messages = chatCenter.getMessage(message.id, message.to);
      sendMessage(Events.RefreshMessages, {
        messages,
        sender: message.id,
        receiver: message.to
      });
    },

    onMessage(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      chatCenter.addMessage(message.content, user.id, message.to);
      const messages = chatCenter.getMessage(user.id, target.id);
      console.log(messages);
      [user.socket, target.socket].forEach(_socket => sendMessage(Events.RefreshMessages, {
        messages,
        sender: user.id,
        receiver: message.to
      }, _socket));
    },

    onCall(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.Call, {
        id: user.id,
        to: message.to,
        name: user.name,
        isVideo: message.isVideo
      }, target.socket);
    },

    onCandidate(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.Candidate, {
        id: user.id,
        to: message.to,
        type: message.type,
        candidate: message.candidate
      }, target.socket);
    },

    onAccept(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.Accept, {
        id: user.id,
        to: message.to,
        accept: message.accept
      }, target.socket);
    },

    onOffer(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.Offer, {
        id: user.id,
        to: message.to,
        offer: message.offer,
        type: message.type
      }, target.socket);
    },

    onAnswer(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.Answer, {
        id: user.id,
        to: message.to,
        type: message.type,
        answer: message.answer
      }, target.socket);
    },

    onLeave(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.Leave, {
        id: user.id,
        to: message.to
      }, target.socket);
    },

    onStartPrivateMessage(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.StartPrivateMessage, {
        id: user.id,
        to: message.to
      }, target.socket);
    },

    onEndPrivateMessage(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.EndPrivateMessage, {
        id: user.id,
        to: message.to
      }, target.socket);
    },

    onSendFile(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.SendFile, {
        id: user.id,
        to: message.to,
        ...message
      }, target.socket);
    },

    onAcceptFile(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.AcceptFile, {
        id: user.id,
        to: message.to,
        ...message
      }, target.socket);
    },

    onUnSupport(message: IWebSocketMessage) {
      const target = self.getUser(message.to);
      sendMessage(Events.UnSupport, {
        id: user.id,
        to: message.to,
        ...message
      }, target.socket);
    },

    getUser(id: string) {
      const user = chatCenter.getUser(id);
      if (!user) throw new Error(`user does not exist`);
      return user;
    },
    broadcast(callback: (socket: WebSocket) => void) {
      chatCenter.users.map(user => callback(user.socket));
    }

  };
  
  const sendMessage = (event: string, data: IKeyValueMap, _socket?: WebSocket) => {
    (_socket ? _socket : socket).send(JSON.stringify({
      event,
      ...data
    }));
  };
  return self;
};
