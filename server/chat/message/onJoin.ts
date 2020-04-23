import ChatCenter, { IUser } from "..";
import Guid from 'guid';
import WebSocket from 'ws';
import { IWebSocketMessage } from "../../interface";

export default (socket: WebSocket, chatCenter: ChatCenter, message: IWebSocketMessage) => {
  let user: IUser;
  console.log(new Date().getTime());
  console.log(chatCenter.getPlainUsers());
  if (chatCenter.hasUser(message.id)) {
    user = chatCenter.getUser(message.id);
    user.socket = socket;
    user.timer && clearTimeout(user.timer);
    user.timer = null;
  } else if (message.name) {
    user = {
      socket,
      id: Guid.raw(),
      name: message.name,
      timer: null,
    };
    chatCenter.addUser(user);
  } else {
    throw new Error('no user');
  } 
  return user;
};