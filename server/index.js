"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var server_1 = __importDefault(require("./chat/server"));
var chat_1 = __importDefault(require("./chat"));
var base_1 = require("../src/common/enums/base");
// const server = https.createServer({
//     key: fs.readFileSync('./ssl/privatekey.pem'),
//     cert: fs.readFileSync('./ssl/certificate.pem')
// });
var wss = new ws_1.default.Server({ port: 8000 });
console.log('The HTTPS server is up and running');
var chatCenter = new chat_1.default();
console.log('Socket Secure server is up and running.');
wss.on('connection', function (socket) {
    var chatServer = server_1.default(socket, chatCenter);
    socket.on('message', function (data) {
        try {
            var message = JSON.parse(data);
            switch (message.event) {
                case base_1.Events.Join:
                    chatServer.onJoin(message);
                    break;
                case base_1.Events.Logout:
                    chatServer.onLogout(message);
                    break;
                case base_1.Events.RefreshUsers:
                    chatServer.onRefreshUsers();
                    break;
                case base_1.Events.RefreshMessages:
                    chatServer.onRefreshMessages(message);
                    break;
                case base_1.Events.Message:
                    chatServer.onMessage(message);
                    break;
                case base_1.Events.Call:
                    chatServer.onCall(message);
                    break;
                case base_1.Events.Offer:
                    chatServer.onOffer(message);
                    break;
                case base_1.Events.Candidate:
                    chatServer.onCandidate(message);
                    break;
                case base_1.Events.Accept:
                    chatServer.onAccept(message);
                    break;
                case base_1.Events.Answer:
                    chatServer.onAnswer(message);
                    break;
                case base_1.Events.Leave:
                    chatServer.onLeave(message);
                    break;
                case base_1.Events.StartPrivateMessage:
                    chatServer.onStartPrivateMessage(message);
                    break;
                case base_1.Events.EndPrivateMessage:
                    chatServer.onEndPrivateMessage(message);
                    break;
                case base_1.Events.SendFile:
                    chatServer.onSendFile(message);
                    break;
                case base_1.Events.AcceptFile:
                    chatServer.onAcceptFile(message);
                    break;
                case base_1.Events.UnSupport:
                    chatServer.onUnSupport(message);
                    break;
            }
        }
        catch (e) {
            socket.send(JSON.stringify({
                event: base_1.Events.Error,
                error: JSON.stringify(e, Object.getOwnPropertyNames(e))
            }));
        }
    });
});
// server.listen(8000);
//# sourceMappingURL=index.js.map