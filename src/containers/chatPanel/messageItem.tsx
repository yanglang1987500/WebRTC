import React from 'react';
import classnames from 'classnames';
import { IChatMessage, IUser } from 'server/chat';

const MessageItem = (props: IMessageProps) => {
  const { message, id, getUserById } = props;
  const self = message.sender === id;
  const float = !self ? 'left' : 'right';
  const sender = getUserById(message.sender);
  const receiver = getUserById(message.receiver);
  return <div className={classnames("chat-message-item")}>
    <div
      style={{ float }}
      className={classnames("chat-message-item-wrap", self ? "align-right" : "align-left")}
    >
      {!self && <span className="chat-message-author">{sender ? sender.name : ''}</span>}
      <div className={classnames("chat-message-content", self ? "align-right" : "align-left")}
        dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/gi, '<br/>') }}
      >
        
      </div>
      {self && <span className="chat-message-author">{sender ? sender.name : ''}</span>}
    </div>
  </div>;
};

interface IMessageProps {
  id: string;
  message: IChatMessage;
  getUserById(id: string): IUser;
}

export default MessageItem;