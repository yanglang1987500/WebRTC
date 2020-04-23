export interface IJoinData {
  id: string;
  name: string;
}

export type ICallAction = {
  to: string;
}

export type IChatMessage = {
  to: string;
  content: string;
}

export interface IWebSocketMessage<T=any> {
  event: string;
  id?: string;
  name?: string;
  to?: string;
  content?: string;
  messages?: T; 
  candidate?: any;
  error?: any;
  accept?: boolean;
  offer?: any;
  answer?: any;
  isVideo?: boolean;
  type?: rtcType;
}

type rtcType = 'media' | 'file' | 'message';
