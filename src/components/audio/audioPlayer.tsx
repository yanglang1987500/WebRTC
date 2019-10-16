import React from 'react';
import ReactPlayer from 'react-player';

class AudioPlayer extends React.Component<IAudioPlayerProps, IAudioPlayerStates> {

  constructor(props: IAudioPlayerProps) {
    super(props);
    this.state = {
      isPlaying: false
    };
  }

  togglePlayAudio() {
    const { onClick, multi } = this.props;
    if (multi && onClick) {
      onClick();
      return;
    }
    this.setState(state => ({
      isPlaying: !state.isPlaying
    }));
  }

  render() {
    const { fileName, fileUrl, multi, isPlaying } = this.props;
    const isPlay = multi ? isPlaying : this.state.isPlaying;
    return (
      <a
        className={`d-block fancybox-thumb file file-voice ${isPlay ? 'file-videos-play' : ''}`}
        href="javascript:void(0)"
        title={fileName}
        onClick={() => this.togglePlayAudio()}
      >
        <i className={`iconfont icon-mp3 text-white`} style={{ display: isPlay ? "none" : "" }} />
        <ReactPlayer url={fileUrl} playing={isPlay} style={{ display: "none" }} onEnded={() => this.togglePlayAudio()}/>
        <span className="audio-pulse audio-pluse-md" style={{ display: !isPlay ? "none" : "" }} >
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      </a>
    );
  }
}

interface IAudioPlayerProps {
  fileName?: string;
  fileUrl: string;
  multi?: boolean;
  isPlaying?: boolean;
  onClick?: Function;
}

interface IAudioPlayerStates {
  isPlaying: boolean;
}

export default AudioPlayer;