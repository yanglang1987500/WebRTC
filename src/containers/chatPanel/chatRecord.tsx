import React from 'react';
import { inject, observer } from 'mobx-react';
import { ChatCenterBusiness, IChatCenterBusinessProps } from '@business/chatCenter';
import MessageItem from './messageItem';

@inject(ChatCenterBusiness)
@observer
class ChatRecord extends React.Component<IChatRecordProps, IChatRecordStates> {

  componentDidMount() {
    const { fetchMessages } = this.props;
    fetchMessages();
  }

  render() {
    const { getMessage, chatUserId, id, getUserById } = this.props;
    const messageGroup = getMessage(id, chatUserId);
    return <div className="chat-record-area">
      {
        messageGroup && messageGroup.messages &&
        messageGroup.messages.map(message => <MessageItem message={message} id={id} getUserById={getUserById} />)
      }
    </div>;
  }
}

interface IChatRecordProps extends Partial<IChatCenterBusinessProps> {
}

interface IChatRecordStates {
}

export default ChatRecord;