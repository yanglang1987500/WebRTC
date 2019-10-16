import React from 'react';

export const audioPlayers: IAudioProps[] = null;

export const AudioPlayersContext = React.createContext({
  audioPlayers,
  audioClick: (audio: IAudioProps) => {},
  stopAllAudio: () => {},
});

export interface IAudioProps {
  key: string;
  isPlaying: boolean;
}
