import Cookies from 'js-cookie';

export class Localstorage {
  public static read(key: string) {
    if (window.localStorage) {
      return window.localStorage[key];
    }
    return null;
  }
  public static write(key: string, value: any) {
    if (window.localStorage) {
      window.localStorage[key] = value;
    }
  }
}

export const cookie = (key: string, value?: string | object, option?: Object): any => {
  if (typeof value !== 'undefined') {
    Cookies.set(key, value, option);
  } else {
    return Cookies.get(key);
  }
};