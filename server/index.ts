import WebSocket from 'ws';
import { IWebSocketMessage } from './interface';
import ChatServer from './chat/server';
import ChatCenter from './chat';
import { Events } from '../src/common/enums/base';
import https from 'https';
import fs from 'fs';

// const server = https.createServer({
//     key: fs.readFileSync('./ssl/privatekey.pem'),
//     cert: fs.readFileSync('./ssl/certificate.pem')
// });
var wss = new WebSocket.Server({ port: 8000 });
console.log('The HTTPS server is up and running');
const chatCenter = new ChatCenter();
console.log('Socket Secure server is up and running.');

wss.on('connection', socket => {
  const chatServer = ChatServer(socket, chatCenter)
  socket.on('message', data => {
    try {
      const message = JSON.parse(data as string) as IWebSocketMessage;
      switch (message.event) {
        case Events.Join:
          chatServer.onJoin(message);
          break;
        case Events.Logout:
          chatServer.onLogout(message);
          break;
        case Events.RefreshUsers:
          chatServer.onRefreshUsers();
          break;
        case Events.RefreshMessages:
          chatServer.onRefreshMessages(message);
          break;
        case Events.Message:
          chatServer.onMessage(message);
          break;
        case Events.Call:
          chatServer.onCall(message);
          break;
        case Events.Offer:
          chatServer.onOffer(message);
          break;
        case Events.Candidate:
          chatServer.onCandidate(message);
          break;
        case Events.Accept:
          chatServer.onAccept(message);
          break;
        case Events.Answer:
          chatServer.onAnswer(message);
          break;
        case Events.Leave:
          chatServer.onLeave(message);
          break;
        case Events.StartPrivateMessage:
          chatServer.onStartPrivateMessage(message);
          break;
        case Events.EndPrivateMessage:
          chatServer.onEndPrivateMessage(message);
          break;
        case Events.SendFile:
          chatServer.onSendFile(message);
          break;
        case Events.AcceptFile:
          chatServer.onAcceptFile(message);
          break;
        case Events.UnSupport:
          chatServer.onUnSupport(message);
          break;
      }
    } catch(e) {
      socket.send(JSON.stringify({
        event: Events.Error,
        error: JSON.stringify(e,  Object.getOwnPropertyNames(e))
      }));
    }
    
  });
});

// server.listen(8000);



