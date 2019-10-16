import { configure } from 'mobx';

configure({ enforceActions: 'observed' });
export class Store {

  constructor() {
  }
}

export default new Store();