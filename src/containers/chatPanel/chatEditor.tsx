import React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { ChatCenterBusiness, IChatCenterBusinessProps } from '@business/chatCenter';
import { VideoAudioBusiness, IVideoAudioBusinessProps } from '@business/videoAudio';
import { combine } from '@store/util';
import { PrivateMessageBusiness, IPrivateMessageBusinessProps } from '@business/privateMessage';
import { FileTransferBusiness, IFileTransferBusinessProps } from '@business/fileTransfer';
import { ContentEditable } from '@components';
import e from 'express';

@inject(combine(ChatCenterBusiness, VideoAudioBusiness, PrivateMessageBusiness, FileTransferBusiness))
@observer
class ChatEditor extends React.Component<IChatEditorProps, IChatEditorStates> {

  state: IChatEditorStates = {
    text: ''
  };

  componentDidMount() {
    this.bindEvents();
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  dropzone: HTMLDivElement;

  sendMessage = () => {
    const { sendMessage, chatUserId, privateMessage, sendPrivateMessage } = this.props;
    if (this.state.text.trim() === '') return;
    if (privateMessage) {
      sendPrivateMessage(this.state.text);
    } else {
      sendMessage(this.state.text, chatUserId);
    }
    this.setState({ text: '' });
  }

  fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { sendFile } = this.props;
    const files = e.target.files;
    for(let i = 0; i < files.length; i++) {
      sendFile(files.item(i));
    }
  }

  bindEvents = () => {
    if (this.dropzone) {
      this.dropzone.addEventListener('drop', this.onDrop);
      this.dropzone.addEventListener('dragenter', this.onDragEnter);
      this.dropzone.addEventListener('dragleave', this.onDragLeave);
      this.dropzone.addEventListener('dragover', this.onPrevent);
    }
  }

  unbindEvents = () => {
    if (this.dropzone) {
      this.dropzone.removeEventListener('drop', this.onDrop);
      this.dropzone.removeEventListener('dragenter', this.onDragEnter);
      this.dropzone.removeEventListener('dragleave', this.onDragLeave);
      this.dropzone.removeEventListener('dragover', this.onPrevent);
    }
  }

  onPrevent = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }

  onDragEnter = (e: DragEvent) => {
    let target = e.target as HTMLElement;
    target.classList.add('highlight'); 
    e.preventDefault();
  }

  onDragLeave = (e: DragEvent) => {
    let target = e.target as HTMLElement;
    target.classList.remove('highlight'); 
    e.preventDefault();
  }

  onDrop = (e: DragEvent) => {
    let target = e.target as HTMLElement;
    const { sendFile } = this.props;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for(let i = 0; i < files.length; i++) {
        sendFile(files.item(i));
      }
    }
    target.classList.remove('highlight');
    e.preventDefault();
  }

  render() {
    const { call, privateMessage, startPrivateMessage, endPrivateMessage, videoSupport, audioSupport } = this.props;
    return <div className="chat-input-area">
      <div className="chat-toolbar">
        {audioSupport && <i className="icon icon-telephone" title="语音通话" onClick={() => call(false)} />}
        {videoSupport && <i className="icon icon-video-call" title="视频通话" onClick={() => call(true)} />}
        <i
          className={classnames("icon icon-speech-bubble", privateMessage && "active")}
          title="密聊模式"
          onClick={() => privateMessage ? endPrivateMessage() : startPrivateMessage()}
        />
        <label htmlFor="fileSelect"><i className="icon icon-folder" title="发送文件" /></label>
        <input type="file" multiple id="fileSelect" onChange={this.fileChange} style={{ display: 'none' }} />
      </div>
      <ContentEditable
        className="textarea"
        value={this.state.text}
        onRef={(dom) => { this.dropzone = dom as HTMLDivElement; }}
        onChange={e => {
          this.setState({ text: (e.target as HTMLInputElement).value });
        }}
        onKeyDown={e => {
          if (e.keyCode === 13 && !e.ctrlKey) {
            this.sendMessage();
            e.preventDefault();
          } else if (e.keyCode === 13 && e.ctrlKey) {
            this.setState({ text: this.state.text + '\n' })
          }
        }}
      />
    </div>;
  }
}

interface IChatEditorProps extends Partial<IChatCenterBusinessProps>,
  Partial<IVideoAudioBusinessProps>, Partial<IPrivateMessageBusinessProps>, Partial<IFileTransferBusinessProps> {
}

interface IChatEditorStates {
  text: string;
}

export default ChatEditor;