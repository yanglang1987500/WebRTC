import { IStoreContainer } from '@common/interface/store';
import { ITransferFile } from '@common/enums/base';

export const FileTransferBusiness = (storeContainer: IStoreContainer) => {
  const { store } = storeContainer;
  const { chatCenterStore } = store;
  const chatUserId = chatCenterStore.chatUserId;
  const fileTransfer = chatCenterStore.fileTransferList.find(p => p.to === chatUserId);
  const propsConnect = {
    receiveFileQueue: fileTransfer.receiveFileQueue,
    sendFileQueue: fileTransfer.sendFileQueue,
  };
  const dispatchConnect = {
    sendFile: fileTransfer.sendFile.bind(fileTransfer),
    acceptFile: fileTransfer.acceptFile.bind(fileTransfer),
    downloadFile: fileTransfer.downloadFile.bind(fileTransfer),
    deleteFile: fileTransfer.deleteFile.bind(fileTransfer),
    clearSendFile: fileTransfer.clearSendFile.bind(fileTransfer),
  };

  return {
    ...propsConnect,
    ...dispatchConnect,
  };
};

export interface IFileTransferBusinessProps {
  receiveFileQueue: ITransferFile[];
  sendFileQueue: ITransferFile[];
  sendFile(file: File): Promise<void>;
  acceptFile(fileId: string, accept: boolean): void;
  downloadFile(fileId: string): void;
  deleteFile(fileId: string): void;
  clearSendFile(fileId: string): void;
}