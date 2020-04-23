import { IStoreContainer } from '@common/interface/store';
import { IUser, IChatMessageGroup } from 'server/chat';

export const ChatCenterBusiness = (storeContainer: IStoreContainer) => {
  const { store } = storeContainer;
  const { chatCenterStore } = store;

  const propsConnect = {
    id: chatCenterStore.id,
    wsready: chatCenterStore.wsready,
    users: chatCenterStore.users.filter(user => user.id !== chatCenterStore.id),
    messageCenter: chatCenterStore.messageCenter,
    chatUserId: chatCenterStore.chatUserId,
  };
  const dispatchConnect = {
    sendMessage: chatCenterStore.sendMessage.bind(chatCenterStore),
    setActiveUser: chatCenterStore.setActiveUser.bind(chatCenterStore),
    join: chatCenterStore.join.bind(chatCenterStore),
    fetchUsers: chatCenterStore.fetchUsers.bind(chatCenterStore),
    setId: chatCenterStore.setId.bind(chatCenterStore),
    getMessage: chatCenterStore.getMessage.bind(chatCenterStore),
    fetchMessages: chatCenterStore.fetchMessages.bind(chatCenterStore),
    getUserById: chatCenterStore.getUserById.bind(chatCenterStore),
    download: chatCenterStore.download.bind(chatCenterStore),
    logout: chatCenterStore.logout.bind(chatCenterStore),
  };

  return {
    ...propsConnect,
    ...dispatchConnect,
  };
};

export interface IChatCenterBusinessProps {
  id: string;
  wsready: boolean;
  users: IUser[];
  chatUserId: string;
  messageCenter: IChatMessageGroup;
  sendMessage(content: string, to: string): void;
  setActiveUser(id: string): void;
  join(name: string, id?: string): Promise<void>;
  fetchUsers(): void;
  setId(id: string): void;
  getMessage(sender: string, receiver: string): IChatMessageGroup;
  fetchMessages(): void;
  logout(): void;
  getUserById(id: string): IUser;
  download(url: string, filename: string): void;
}