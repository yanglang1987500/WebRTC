import { configure } from 'mobx';
import ChatCenterStore from './chatCenter';

configure({ enforceActions: 'observed' });
export class Store {

  chatCenterStore: ChatCenterStore = null;
  
  constructor() {
    this.chatCenterStore = new ChatCenterStore();
  }
}

export default new Store();