import React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { ChatCenterBusiness, IChatCenterBusinessProps } from '@business/chatCenter';
import { MediaChatStatus } from '@common/enums/base';
import ChatVideoCallOut from './chatVideoCallOut';
import ChatVideoCallIn from './chatVideoCallIn';
import ChatVideoChatting from './chatVideoChatting';
import guid from 'guid';
import { IVideoAudioBusinessProps, VideoAudioBusiness } from '@business/videoAudio';
import { combine } from '@store/util';
import { UserMediaRecorder } from '../../../webrtc';

@inject(combine(ChatCenterBusiness, VideoAudioBusiness))
@observer
class ChatVideo extends React.Component<IChatVideoProps, IChatVideoStates> {

  state: IChatVideoStates = {
    selfSmall: false,
    first: true,
    recording: false
  };

  localMedia: HTMLVideoElement | HTMLAudioElement;
  remoteMedia: HTMLVideoElement | HTMLAudioElement;
  componentDidMount() {
    this.updateMediaStream()    
  }
  
  componentDidUpdate() {
    this.updateMediaStream()
  }

  static getDerivedStateFromProps(props: IChatVideoProps, state: IChatVideoStates) {
    const { remoteMediaStream  } = props;
    if (remoteMediaStream && state.first) {
      return { selfSmall: true, first: false };
    }
    return null;
  }
  
  updateMediaStream() {
    const { localMediaStream, remoteMediaStream } = this.props;
    if (this.localMedia && localMediaStream) {
      this.localMedia.srcObject = localMediaStream
    }
    if (this.remoteMedia && remoteMediaStream ) {
      this.remoteMedia.srcObject = remoteMediaStream
    }
  }

  componentWillUnmount() {
    this.localMedia && (this.localMedia.srcObject = null);
    this.remoteMedia && (this.remoteMedia.srcObject = null);
  }

  takePhoto() {
    const { download } = this.props;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvas.getContext('2d').drawImage(this.remoteMedia as HTMLVideoElement, 0, 0, canvas.width, canvas.height);
    download(canvas.toDataURL('image/jpeg'), `photo_${guid.raw().substr(0, 8)}.jpeg`);
  }

  record: UserMediaRecorder;

  startRecord() {
    const { remoteMediaStream, isVideo } = this.props;
    console.log('start record');
    this.record = new UserMediaRecorder(remoteMediaStream, isVideo ? 'video/webm;codecs=h264' : 'audio/webm');
    this.record.initialize();
    this.record.start();
    this.setState({ recording: true });
  }

  async endRecord() {
    const { download, isVideo } = this.props;
    this.setState({ recording: false });
    const data = await this.record.stop();
    this.record.dispose();
    console.log('end record');
    download(window.URL.createObjectURL(data),
      `${isVideo ? 'video' : 'audio'}_${guid.raw().substr(0, 8)}.${isVideo ? 'webm' : 'ogg'}`);
  }

  render() {
    const { mediaChatStatus, chatUserId, getUserById, isVideo, accept, reject, leave,
      localMediaStream, remoteMediaStream } = this.props;
    const { selfSmall } = this.state;
    const chatUser = getUserById(chatUserId);
    const muted = mediaChatStatus !== MediaChatStatus.Chatting;
    return <div className="chat-video-container">
      {(mediaChatStatus === MediaChatStatus.CallIn || mediaChatStatus === MediaChatStatus.CallOut) && <audio loop src="sources/call.mp3" autoPlay />}
      { isVideo && <video
        style={{ display: localMediaStream ? 'block' : 'none' }}
        muted={muted}
        autoPlay
        playsInline
        onClick={() => {
          debugger;
          if (this.state.selfSmall) {
            this.setState({ selfSmall: false });
          }
        }}
        className={classnames("chat-video-local-play", selfSmall && 'small')}
        ref={dom => this.localMedia = dom}
        />}
      { isVideo && <video
        style={{ display: remoteMediaStream ? 'block' : 'none' }}
        muted={muted}
        autoPlay
        playsInline
        onClick={() => {
          debugger;
          if (!this.state.selfSmall) {
            this.setState({ selfSmall: true });
          }
        }}
        className={classnames("chat-video-remote-play", !selfSmall && 'small')}
        ref={dom => this.remoteMedia = dom}
      />}
      { !isVideo && <audio
        autoPlay
        muted={muted}
        ref={dom => this.localMedia = dom}
      />}
      { !isVideo && <audio
        autoPlay
        muted={muted}
        ref={dom => this.remoteMedia = dom}
      />}
      {mediaChatStatus === MediaChatStatus.CallOut &&
        <ChatVideoCallOut
          chatUserName={chatUser.name}
          onReject={() => leave()}
          video={isVideo}
        />}
      {mediaChatStatus === MediaChatStatus.CallIn &&
        <ChatVideoCallIn
          chatUserName={chatUser.name}
          onReject={() => reject()}
          onAnswer={() => accept()}
          video={isVideo}
        />}
      {mediaChatStatus === MediaChatStatus.Chatting &&
        <ChatVideoChatting
          chatUserName={chatUser.name}
          recording={this.state.recording}
          onLeave={() => leave()}
          onStartRecord={() => this.startRecord()}
          onEndRecord={() => this.endRecord()}
          takePhoto={() => this.takePhoto()}
          video={isVideo} 
        />}
    </div>;
  }
}

interface IChatVideoProps extends Partial<IChatCenterBusinessProps>, Partial<IVideoAudioBusinessProps> {
}

interface IChatVideoStates {
  selfSmall: boolean;
  first: boolean;
  recording: boolean;
}

export default ChatVideo;

