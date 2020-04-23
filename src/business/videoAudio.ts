import { IStoreContainer } from '@common/interface/store';
import { MediaChatStatus } from '@common/enums/base';

export const VideoAudioBusiness = (storeContainer: IStoreContainer) => {
  const { store } = storeContainer;
  const { chatCenterStore } = store;

  const propsConnect = {
    mediaChatStatus: chatCenterStore.videoAudio.mediaChatStatus,
    localMediaStream: chatCenterStore.videoAudio.localMediaStream,
    remoteMediaStream: chatCenterStore.videoAudio.remoteMediaStream,
    isVideo: chatCenterStore.videoAudio.isVideo,
    videoSupport: chatCenterStore.videoAudio.videoSupport,
    audioSupport: chatCenterStore.videoAudio.audioSupport,
  };
  const dispatchConnect = {
    call: chatCenterStore.videoAudio.call.bind(chatCenterStore.videoAudio),
    accept: chatCenterStore.videoAudio.accept.bind(chatCenterStore.videoAudio),
    reject: chatCenterStore.videoAudio.reject.bind(chatCenterStore.videoAudio),
    leave: chatCenterStore.videoAudio.leave.bind(chatCenterStore.videoAudio),
  };

  return {
    ...propsConnect,
    ...dispatchConnect,
  };
};

export interface IVideoAudioBusinessProps {
  mediaChatStatus: MediaChatStatus;
  localMediaStream: MediaStream;
  remoteMediaStream: MediaStream;
  isVideo: boolean;
  videoSupport: boolean;
  audioSupport: boolean;
  call(video: boolean): Promise<void>;
  accept(): void;
  reject(): void;
  leave(): void;
}