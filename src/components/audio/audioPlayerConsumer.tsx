import React from 'react';
import AudioPlayer from "./audioPlayer";
import { AudioPlayersContext } from './context';

const AudioPlayerConsumer = (props: IAudioPlayerConsumerProps) => {
  const { fileUrl, fileName } = props;
  return (
    <AudioPlayersContext.Consumer>
      {({ audioPlayers, audioClick }) => {
        const player = audioPlayers && audioPlayers.filter(item => item.key === fileUrl)[0];
        const isPlaying = player ? player.isPlaying : false;
        const multi = !!audioPlayers;
        return <AudioPlayer
          multi={multi}
          fileUrl={fileUrl}
          fileName={fileName}
          isPlaying={isPlaying}
          onClick={() => audioClick({ key: fileUrl, isPlaying: true })}
        />;
      }}
      
    </AudioPlayersContext.Consumer>
  );
};

export interface IAudioPlayerConsumerProps {
  fileUrl?: string;
  fileName?: string;
}

export default AudioPlayerConsumer;