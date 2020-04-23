import Cookies from 'js-cookie';

export class Localstorage {
  public static read(key: string) {
    return window.localStorage.getItem(key);
  }
  public static write(key: string, value: any) {
    window.localStorage.setItem(key, value);
  }
  public static remove(key: string) {
    window.localStorage.removeItem(key);
  }
}

export const cookie = (key: string, value?: string | object, option?: Object): any => {
  if (typeof value !== 'undefined') {
    Cookies.set(key, value, option);
  } else {
    return Cookies.get(key);
  }
};