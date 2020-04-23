export enum Type {
  Number = "Number",
  String = "String",
  Boolean = "Boolean",
  Object = "Object",
  Array = "Array",
  Function = "Function"
};

export enum HttpStatusType {
  Continue = 100,
  SwitchingProtocol = 101,
  Processing = 102,
  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultipleChoice = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500
};

export enum ContentType {
  Image = 1,
  Word = 2,
  Excel = 3,
  Pdf = 4,
  Video = 5,
  Message = 6,
  Email = 7,
  Ppt = 8,
  Audio = 9,
  Unknow = 10
};

export enum Events {
  Join = 'join',
  Logout = 'logout',
  RefreshUsers = 'refreshUsers',
  RefreshMessages = 'refreshMessages',
  Message = 'message',
  Call = 'call',
  Offer = 'offer',
  Error = 'error',
  Candidate = 'candidate',
  Accept = 'accept',
  Answer = 'answer',
  Leave = 'leave',
  StartPrivateMessage = 'startPrivateMessage',
  EndPrivateMessage = 'endPrivateMessage',
  SendFile = 'sendFile',
  AcceptFile = 'acceptFile',
  UnSupport = 'unSupport',
};

export enum MediaChatStatus {
  None = 1,
  CallIn = 2,
  Chatting = 3,
  CallOut = 4,
};

export interface ITransferFile {
  file?: File;
  data?: ArrayBuffer[];
  totalSize?: number;
  transferedSize?: number;
  name?: string;
  id?: string;
  progress?: number;
  status?: TransferStatus;
};

export enum TransferStatus {
  Wait = 1,
  Transfering = 2,
  Complete = 3
};