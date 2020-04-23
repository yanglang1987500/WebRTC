import DataChannel from "./dataChannel";

export default class PeerConnection {

  iceServers: RTCIceServer[];
  _conn: RTCPeerConnection;
  offer: RTCSessionDescriptionInit;
  answer: RTCSessionDescriptionInit;
  isCaller: boolean = false;
  state: RTCIceConnectionState;
  candidate: RTCIceCandidate;
  isCandidateFired: boolean = false;
  onicecandidate: (candidate: RTCIceCandidate) => void;
  ontrack: (event: RTCTrackEvent) => void;
  ondatachannel: (channel: DataChannel) => void;

  get connection(): RTCPeerConnection {
    if (!this._conn)
      throw new Error('Connection is not available, please call initialize first');
    return this._conn;
  }
  set connection(conn: RTCPeerConnection) {
    this._conn = conn;
  }

  constructor(iceServers = [{
    urls: 'stun:stun.xten.com'
  },{
    urls: 'turn:numb.viagenie.ca',
    credential: '077032',
    username: '676702008@qq.com'
  }]) {
    this.iceServers = iceServers;
  }

  initialize() {
    const conn = new RTCPeerConnection({ iceServers: this.iceServers });
    this.connection = conn;
    conn.onconnectionstatechange = event => {
      this.state = conn.iceConnectionState;
    };

    conn.onicecandidate = event => {
      if (!this.isCandidateFired && event.candidate && event.candidate.candidate) {
        this.isCandidateFired = true;
        this.candidate = event.candidate;
        typeof this.onicecandidate === 'function' && this.onicecandidate(this.candidate);
      }
    };

    conn.ondatachannel = event => {
      const channel = new DataChannel(this, null, event.channel);
      channel.initialize();
      if (channel && typeof this.ondatachannel === 'function') {
        this.ondatachannel(channel);
      }
    };

    conn.onicecandidateerror = error => console.log(error);

    conn.ontrack = event => {
      typeof this.ontrack === 'function' && this.ontrack(event);
    };
    return conn;
  }

  dispose() {
    this._conn.close();
    this._conn.onicecandidate = null;
    this._conn.ondatachannel = null;
    this._conn.ontrack = null;
    this._conn.onconnectionstatechange = null;
    this._conn = null;
  }

  async createOffer(options = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  }) {
    const offer = await this.connection.createOffer(options);
    this.offer = offer;
    this.isCaller = true;
    this.connection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer() {
    const answer = await this.connection.createAnswer();
    this.answer = answer;
    this.isCaller = false;
    this.connection.setLocalDescription(answer);
    return answer;
  }

  setRemoteSDP(sdp: RTCSessionDescriptionInit) {
    this.connection.setRemoteDescription(sdp);
  }

  setRemoteCandidate(candidate: RTCIceCandidate) {
    this.connection.addIceCandidate(candidate);
  }

  attachStream(stream: MediaStream) {
    stream.getTracks().forEach(track => {
      this.connection.addTrack(track, stream);
    });
  }

}