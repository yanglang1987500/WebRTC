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