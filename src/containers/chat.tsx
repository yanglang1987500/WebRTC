import React from 'react';
import { inject, observer } from 'mobx-react';
import { ChatCenterBusiness, IChatCenterBusinessProps } from '@business/chatCenter';
import SideBar from './sidebar';
import ChatPanel from './chatPanel/index';

@inject(ChatCenterBusiness)
@observer
class Chat extends React.Component<IChatProps, IChatStates> {

  render() {
    return <div>
      <div className="chat-container">
        <SideBar />
        <ChatPanel />
      </div>
    </div>;
  }
}

interface IChatProps extends Partial<IChatCenterBusinessProps> {
}

interface IChatStates {
}

export default Chat;