import React from 'react';
import { Dot } from '@components';
import { ICommonVideoChatProps } from './interface';

const ChatVideoCallOut = (props: IChatVideoCallOutProps) => {
  const { chatUserName, video, onReject } = props;
  let disable = false;
  return <div className="chat-video-face">
    <p className="chat-video-caller">{chatUserName}</p>
    <p className="chat-video-desc">{video ? '视频' : '语音'}拨号中<Dot dots={4} /></p>
    <div className="chat-video-btn-group">
      <span className="chat-video-btn btn-reject" onClick={() => { if(disable) return; disable = true; onReject()}}>
        <i className="icon icon-call-answer" />
      </span>
    </div>
  </div>;
}

interface IChatVideoCallOutProps extends ICommonVideoChatProps {
  onReject: () => void;
}

export default ChatVideoCallOut;