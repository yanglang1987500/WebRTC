import React from 'react';
import classnames from 'classnames';
import { ICommonVideoChatProps } from './interface';
import { Dot } from '@components';

const ChatVideoChatting = (props: IChatVideoChattingProps) => {
  const { onLeave, video, chatUserName, onStartRecord, onEndRecord, recording, takePhoto } = props;
  let disable = false;
  return <div className="chat-video-face">
    { !video && <React.Fragment>
      <p className="chat-video-caller">{chatUserName}</p>
      <p className="chat-video-desc">语音通话中</p>
    </React.Fragment>}
    { video && <i className="icon icon-photo-camera" title="拍照" onClick={() => takePhoto && takePhoto()} />}
    {!recording &&　<i className="icon icon-video-call record-video-audio" title="开始录制" onClick={() => onStartRecord && onStartRecord()} />}
    {recording && <i className="icon record-stop-video-audio" title="结束录制" onClick={() => onEndRecord && onEndRecord()} />}
    <div className={classnames("chat-video-btn-group", video && 'chatting')}>
      <span className="chat-video-btn btn-reject" onClick={() => { if(disable) return; disable = true; onLeave && onLeave();}}>
        <i className="icon icon-call-answer" />
      </span>
    </div>
  </div>;
}

interface IChatVideoChattingProps extends ICommonVideoChatProps {
  recording: boolean;
  onLeave: () => void;
  onStartRecord: () => void;
  onEndRecord: () => void;
  takePhoto: () => void;
}

export default ChatVideoChatting;