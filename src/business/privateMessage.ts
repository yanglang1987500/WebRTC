import { IStoreContainer } from '@common/interface/store';

export const PrivateMessageBusiness = (storeContainer: IStoreContainer) => {
  const { store } = storeContainer;
  const { chatCenterStore } = store;
  const chatUserId = chatCenterStore.chatUserId;
  const privateMessage = chatCenterStore.privateMessageList.find(p => p.to === chatUserId);
  const propsConnect = {
    privateMessage: privateMessage.privateMessage
  };
  const dispatchConnect = {
    startPrivateMessage: privateMessage.startPrivateMessage.bind(privateMessage),
    endPrivateMessage: privateMessage.endPrivateMessage.bind(privateMessage),
    sendPrivateMessage: privateMessage.sendPrivateMessage.bind(privateMessage),
  };

  return {
    ...propsConnect,
    ...dispatchConnect,
  };
};

export interface IPrivateMessageBusinessProps {
  privateMessage: boolean;
  startPrivateMessage(): void;
  endPrivateMessage(): void;
  sendPrivateMessage(content: string): void;
}