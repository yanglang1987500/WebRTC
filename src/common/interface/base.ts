import { Store } from "@store/index";

export interface IStoreContainer {
  store: Store;
}

export interface IAttachment {
  id: number;
  attachmentName: string;
  attachmentTypeId: string;
  lableId: number;
  url: string;
}

declare global {
  interface Window {
    ga: any;
    store: any;
    FastClick: any;
    google: any;
  }
  interface HTMLElement {
    fadeIn: (interval?: number) => Promise<void>;
    fadeOut: (interval?: number) => Promise<void>;
    removeClass: (className: string) => HTMLElement;
    addClass: (className: string) => HTMLElement;
    hide: () => HTMLElement;
  }
}

