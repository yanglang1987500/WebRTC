import React from 'react';
import { inject, observer } from 'mobx-react';
import { ChatCenterBusiness, IChatCenterBusinessProps } from '@business/chatCenter';
import ChatEditor from './chatEditor';
import ChatRecord from './chatRecord';
import ChatVideo from './chatVideo';
import { MediaChatStatus } from '@common/enums/base';
import { VideoAudioBusiness, IVideoAudioBusinessProps } from '@business/videoAudio';
import { combine } from '@store/util';
import FileTransfer from './fileTransfer';

@inject(combine(ChatCenterBusiness, VideoAudioBusiness))
@observer
class ChatPanel extends React.Component<IChatPanelProps, IChatPanelStates> {

  render() {
    const { chatUserId, users, mediaChatStatus, id, getUserById } = this.props;
    const self = getUserById(id);
    const activeUser = users.find(user => user.id === chatUserId);
    if (!activeUser) {
      return <div className="chat-empty">{self.name}，开始聊天吧~</div>;
    }
    if (mediaChatStatus !== MediaChatStatus.None) {
      return <div className="chat-tab-content">
        <div className="chat-head">{activeUser.name}</div>
        <ChatVideo />
      </div>;
    }
    return <div className="chat-tab-content">
      <div className="chat-head">{activeUser.name}</div>
      <ChatRecord />
      <FileTransfer />
      <ChatEditor />
    </div>;
  }
}

interface IChatPanelProps extends Partial<IChatCenterBusinessProps>, Partial<IVideoAudioBusinessProps> {
}

interface IChatPanelStates {
}

export default ChatPanel;