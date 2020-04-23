import PeerConnection from "./peerConnection";

enum State {
  Open = 1,
  Close = 2
}

export default class DataChannel {
  
  channel: RTCDataChannel;
  peerConnection: PeerConnection;
  name: string;
  state: State;
  onopen: (event: Event) => void;
  onclose: (event: Event) => void;
  onmessage: (event: MessageEvent, data: any) => void;

  constructor(peerConnection: PeerConnection, name: string, channel: RTCDataChannel) {
    this.peerConnection = peerConnection;
    this.name = name;
    this.channel = channel;
  }

  initialize() {
    if (!this.channel) {
      this.channel = this.peerConnection.connection.createDataChannel(this.name, { ordered: true, maxRetransmits: 30 });
    }
    this.channel.onopen = event => {
      this.state = State.Open;
      typeof this.onopen === 'function' && this.onopen(event);
    };
    this.channel.onclose = event => {
      this.state = State.Close;
      typeof this.onclose === 'function' && this.onclose(event);
    };
    this.channel.onmessage = event => {
      typeof this.onmessage === 'function' && this.onmessage(event, event.data);
    };
  }

  sendMessage(message: string | Object) {
    let data: string = null;
    if (typeof message === 'string') data = message;
    if (typeof message === 'object') data = JSON.stringify(message);

    if (data && this.channel && this.channel.readyState === 'open') {
      this.channel.send(data);
    }
  }
  
  sendBlob(data: Blob) {
    if (data && this.channel && this.channel.readyState === 'open') {
      try{
        this.channel.send(data);
      }catch(e){console.log(e)}
    }
  }

  dispose() {
    this.channel.close();
    this.peerConnection = null;
    this.state = State.Close;
    this.name = null;
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
  }

}