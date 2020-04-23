"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var guid_1 = __importDefault(require("guid"));
exports.default = (function (socket, chatCenter, message) {
    var user;
    console.log(new Date().getTime());
    console.log(chatCenter.getPlainUsers());
    if (chatCenter.hasUser(message.id)) {
        user = chatCenter.getUser(message.id);
        user.socket = socket;
        user.timer && clearTimeout(user.timer);
        user.timer = null;
    }
    else if (message.name) {
        user = {
            socket: socket,
            id: guid_1.default.raw(),
            name: message.name,
            timer: null,
        };
        chatCenter.addUser(user);
    }
    else {
        throw new Error('no user');
    }
    return user;
});
//# sourceMappingURL=onJoin.js.map