"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var onJoin_1 = __importDefault(require("./message/onJoin"));
var base_1 = require("../../src/common/enums/base");
exports.default = (function (socket, chatCenter) {
    var user = null;
    socket.on('close', function () {
        if (user) {
            user.timer = setTimeout(function () {
                console.log('clear user: ', user.id);
                chatCenter.removeUser(user.id);
                self.broadcast(function (_socket) { return sendMessage(base_1.Events.RefreshUsers, {
                    users: chatCenter.getPlainUsers()
                }, _socket); });
            }, 10000);
        }
    });
    var self = {
        onJoin: function (message) {
            user = onJoin_1.default(socket, chatCenter, message);
            sendMessage(base_1.Events.Join, {
                id: user.id
            });
            self.broadcast(function (_socket) { return sendMessage(base_1.Events.RefreshUsers, {
                users: chatCenter.getPlainUsers()
            }, _socket); });
        },
        onLogout: function (message) {
            chatCenter.removeUser(message.id);
            self.broadcast(function (_socket) { return sendMessage(base_1.Events.RefreshUsers, {
                users: chatCenter.getPlainUsers()
            }, _socket); });
        },
        onRefreshUsers: function () {
            sendMessage(base_1.Events.RefreshUsers, {
                users: chatCenter.getPlainUsers
            });
        },
        onRefreshMessages: function (message) {
            var messages = chatCenter.getMessage(message.id, message.to);
            sendMessage(base_1.Events.RefreshMessages, {
                messages: messages,
                sender: message.id,
                receiver: message.to
            });
        },
        onMessage: function (message) {
            var target = self.getUser(message.to);
            chatCenter.addMessage(message.content, user.id, message.to);
            var messages = chatCenter.getMessage(user.id, target.id);
            console.log(messages);
            [user.socket, target.socket].forEach(function (_socket) { return sendMessage(base_1.Events.RefreshMessages, {
                messages: messages,
                sender: user.id,
                receiver: message.to
            }, _socket); });
        },
        onCall: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.Call, {
                id: user.id,
                to: message.to,
                name: user.name,
                isVideo: message.isVideo
            }, target.socket);
        },
        onCandidate: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.Candidate, {
                id: user.id,
                to: message.to,
                type: message.type,
                candidate: message.candidate
            }, target.socket);
        },
        onAccept: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.Accept, {
                id: user.id,
                to: message.to,
                accept: message.accept
            }, target.socket);
        },
        onOffer: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.Offer, {
                id: user.id,
                to: message.to,
                offer: message.offer,
                type: message.type
            }, target.socket);
        },
        onAnswer: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.Answer, {
                id: user.id,
                to: message.to,
                type: message.type,
                answer: message.answer
            }, target.socket);
        },
        onLeave: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.Leave, {
                id: user.id,
                to: message.to
            }, target.socket);
        },
        onStartPrivateMessage: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.StartPrivateMessage, {
                id: user.id,
                to: message.to
            }, target.socket);
        },
        onEndPrivateMessage: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.EndPrivateMessage, {
                id: user.id,
                to: message.to
            }, target.socket);
        },
        onSendFile: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.SendFile, __assign({ id: user.id, to: message.to }, message), target.socket);
        },
        onAcceptFile: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.AcceptFile, __assign({ id: user.id, to: message.to }, message), target.socket);
        },
        onUnSupport: function (message) {
            var target = self.getUser(message.to);
            sendMessage(base_1.Events.UnSupport, __assign({ id: user.id, to: message.to }, message), target.socket);
        },
        getUser: function (id) {
            var user = chatCenter.getUser(id);
            if (!user)
                throw new Error("user does not exist");
            return user;
        },
        broadcast: function (callback) {
            chatCenter.users.map(function (user) { return callback(user.socket); });
        }
    };
    var sendMessage = function (event, data, _socket) {
        (_socket ? _socket : socket).send(JSON.stringify(__assign({ event: event }, data)));
    };
    return self;
});
//# sourceMappingURL=server.js.map