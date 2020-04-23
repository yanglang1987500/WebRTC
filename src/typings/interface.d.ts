interface IKeyValueMap<T = any> {
  [key: string]: T;
}

interface IIdName {
  id: string | number;
  name: string;
}

interface IPosition {
  x: number;
  y: number;
}

interface IRouterConfig {
  title: string | React.ReactNode;
  path: string;
  component: React.ComponentClass | React.FunctionComponent;
  titleBar?: string;
  isShowBack?: boolean;
  isHideToggler?: boolean;
}

interface IAttachment {
  ContentType?: string;
  CreateDate?: string;
  FileName?: string;
  FilePath?: string;
  FileUrl?: string;
  Id?: string;
  ThumbnailUrl?: string;
  width?: number;
  height?: number;
}

interface IWebSocketMessage<T=any> {
  event: string;
  users?: IUser[];
  id?: string;
  name?: string;
  to?: string;
  sender?: string;
  receiver?: string;
  messages?: T;
  content?: string;
  error?: any;
  candidate?: any;
  accept?: boolean;
  offer?: any;
  answer?: any;
  isVideo?: boolean;

  fileId?: string;
  fileName?: string;
  totalSize?: number;
  type?: rtcType
}

type rtcType = 'media' | 'file' | 'message';

interface IUser {
  name: string;
  id: string;
}

interface Window {
  promptManager: {
    show: Function;
    showWrongInfo: (msg: string) => void;
  };
  ActiveXObject: (type?: string) => void;
  WebuiPopovers: IKeyValueMap;
}

