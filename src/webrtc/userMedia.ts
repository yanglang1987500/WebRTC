export default class UserMedia {
  
  constraints: MediaStreamConstraints;
  stream: MediaStream;
  videoTracks: MediaStreamTrack[];
  audioTracks: MediaStreamTrack[];

  constructor(constainst: MediaStreamConstraints) {
    this.constraints = constainst;
  }

  async initialize() {
    const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    this.stream = stream;
    this.videoTracks = stream.getVideoTracks();
    this.audioTracks = stream.getAudioTracks();
    return stream;
  }

  stopVideo(index = 0) {
    this.videoTracks && this.videoTracks[index] && this.videoTracks[index].stop();
  }

  stopAudio(index = 0) {
    this.audioTracks && this.audioTracks[index] && this.audioTracks[index].stop();
  }

  dispose() {
    this.stream && this.stream.getTracks().forEach(track => track.stop());
  }
}