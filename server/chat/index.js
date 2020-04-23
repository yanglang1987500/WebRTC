"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var guid_1 = __importDefault(require("guid"));
var ChatCenter = /** @class */ (function () {
    function ChatCenter() {
        this.users = [];
        this.messageCenter = [];
    }
    ChatCenter.prototype.addUser = function (user) {
        if (!this.hasUser(user.id)) {
            this.users.push(user);
        }
    };
    ChatCenter.prototype.getUser = function (id) {
        return this.users.find(function (user) { return user.id === id; });
    };
    ChatCenter.prototype.getPlainUsers = function () {
        return this.users.map(function (user) { return ({
            id: user.id,
            name: user.name
        }); });
    };
    ChatCenter.prototype.hasUser = function (id) {
        return this.users.some(function (user) { return user.id === id; });
    };
    ChatCenter.prototype.removeUser = function (id) {
        this.users = this.users.filter(function (user) { return user.id !== id; });
    };
    ChatCenter.prototype.addMessage = function (content, sender, receiver) {
        var group = this.getMessage(sender, receiver);
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
            id: guid_1.default.raw(),
            sender: sender,
            receiver: receiver,
            content: content,
            timestamp: new Date().getTime()
        });
    };
    ChatCenter.prototype.getMessage = function (sender, receiver) {
        return this.messageCenter.find(function (group) { return group && (group.pair[0] === sender && group.pair[1] === receiver)
            || (group.pair[1] === sender && group.pair[0] === receiver); });
    };
    ChatCenter.prototype.updateMessage = function (sender, receiver, message) {
        var flag = false;
        this.messageCenter = this.messageCenter.map(function (group) {
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
    };
    return ChatCenter;
}());
exports.default = ChatCenter;
//# sourceMappingURL=index.js.map