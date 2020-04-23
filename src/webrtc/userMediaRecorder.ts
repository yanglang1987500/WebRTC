export default class UserMediaRecorder {

  stream: MediaStream;
  mimeType: string;
  recorder: MediaRecorder;

  constructor(stream: MediaStream, mimeType = 'video/webm;codecs=h264') {
    this.stream = stream;
    this.mimeType = mimeType;
  }

  initialize() {
    this.recorder = new MediaRecorder(this.stream, { mimeType: this.mimeType });
    return this.recorder;
  }
  
  start() {
    this.recorder.start();
  }

  stop() {
    return new Promise<Blob>(resolve => {
      this.recorder.ondataavailable = e => {
        resolve(e.data);
        this.recorder.ondataavailable = null;
      };
      this.recorder.stop();
    });
  }

  dispose() {
    this.stream = null;
    this.recorder = null;
    this.mimeType = null;
  }

}