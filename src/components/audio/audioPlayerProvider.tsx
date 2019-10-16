import React from 'react';
import { IAudioProps, AudioPlayersContext } from './context';

class AudioPlayerProvider extends React.Component<IAudioPlayerProviderProps, IAudioPlayerProviderStates> {

  constructor(props: IAudioPlayerProviderProps) {
    super(props);

    const audioClick = (play: IAudioProps) => {
      this.setState(state => ({
        audioPlayers: getAudioPlay(state.audioPlayers, play)
      }));
    };
    const getAudioPlay = (audioPlayers: IAudioProps[], play: IAudioProps) => {
      const index = audioPlayers.findIndex(item => item.key === play.key);
      if (index === -1) {
        audioPlayers.map(item => { item.isPlaying = false; });
        audioPlayers.push(play);
        return audioPlayers;
      }
      const isPlaying = !audioPlayers[index].isPlaying;
      audioPlayers.map(item => { item.isPlaying = false; });
      audioPlayers[index].isPlaying = isPlaying;
      return audioPlayers;
    };

    const stopAllAudio = () => {
      const audioPlayers = this.state.audioPlayers;
      audioPlayers.map(item => { item.isPlaying = false; });
      this.setState({
        audioPlayers
      });
    };

    this.state = {
      audioClick,
      stopAllAudio,
      audioPlayers: [],
    };
  }

  render() {
    return (
      <AudioPlayersContext.Provider
        value={{ audioPlayers: this.state.audioPlayers, audioClick: this.state.audioClick, stopAllAudio: this.state.stopAllAudio }}
      >
        {this.props.children}
      </AudioPlayersContext.Provider>
    );
  }
}

interface IAudioPlayerProviderProps {
}

interface IAudioPlayerProviderStates {
  audioPlayers?: IAudioProps[];
  audioClick?: (player: IAudioProps) => void;
  stopAllAudio?: () => void;
}

export default AudioPlayerProvider;