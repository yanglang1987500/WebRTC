import React from 'react';
import { Dot } from '@components';
import { ICommonVideoChatProps } from './interface';

const ChatVideoCallIn = (props: IChatVideoCallInProps) => {
  const { chatUserName, video, onAnswer, onReject } = props;
  let disable = false;
  return <div className="chat-video-face">
    <p className="chat-video-caller">{chatUserName}</p>
    <p className="chat-video-desc">{video ? '视频' : '语音'}来电<Dot dots={4} /></p>
    <div className="chat-video-btn-group">
      <span className="chat-video-btn btn-resolve" onClick={() => { if(disable) return; disable = true; onAnswer(); }}>
        <i className="icon icon-call-answer" />
      </span>
      <span className="chat-video-btn btn-reject" onClick={() => { if(disable) return; disable = true; onReject(); }}>
        <i className="icon icon-call-answer" />
      </span>
    </div>
  </div>;
}

interface IChatVideoCallInProps extends ICommonVideoChatProps {
  onAnswer: () => void;
  onReject: () => void;
}

export default ChatVideoCallIn;