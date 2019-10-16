export class AudioServer {
  constructor(...args: any[]);
  inputSampleRate: any;
  outputSampleRate: any;
  inputRatio: any;
  outputRatio: any;
  channelCount: any;
  minBufferSize: any;
  maxBufferSize: any;
  sampleCountPerCallback: any;
  audioBuffer: any;
  audioBufferSize: any;
  resampleBufferStart: any;
  resampleBufferEnd: any;
  resampleBufferSize: any;
  resampleBuffer: any;
  resampleControl: any;
  formatCallback: any;
  underrunCallback: any;
  volume: any;
  executeCallback(): void;
  refillResampleBuffer(): void;
  remainingBuffer(): void;
  setVolume(volume: any): void;
  writeAudio(samples: any): void;
  writeAudioNoCallback(samples: any): void;
}
export class Resampler {
  constructor(...args: any[]);
  inputSampleRate: any;
  outputSampleRate: any;
  channelCount: any;
  outputBufferSize: any;
  outputBuffer: any;
  lastOutput: any;
  returnSlice: any;
  resample: any;
  ratioWeight: any;
  lastWeight: any;
  tailExists: any;
}
export function createAudioServer(options: any): any;
export namespace extra {
  class AudiojsAudio {
    constructor(...args: any[]);
    volume: any;
    flagstone: any;
    server: any;
    pushSampleBatch(samples: any): void;
    setInputFormat(_ref2: any): void;
    setVolume(volume: any): void;
    validateInputFormat(): any;
  }
}
export namespace implementations {
  class WebAudioServer {
    static create(...args: any[]): any;
    constructor(options: any);
    attachWebAudioApi(context: any, node: any): void;
    detachWebAudioApi(): void;
    executeCallback(): void;
    refillResampleBuffer(): void;
    remainingBuffer(): any;
    setVolume(volume: any): void;
    writeAudio(samples: any): void;
    writeAudioNoCallback(samples: any): void;
  }
}
