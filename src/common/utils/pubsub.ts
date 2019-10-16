/**
 * @module PubSub
 * PubSub
 * @method PubSub
 * @author yanglang
 * @date 20170830
 */
import { Type } from '@common/enums/base';
import { type } from './index';

interface IEvents {
  [key: string]: Function[];
}

interface INotifyList {
  eventName: string;
  data: any;
  scope: any;
}

let Events: IEvents = {};
let toBeNotify: INotifyList[] = [];
const EVENT_PREFIX = 'TPE';

const PubSub = {
  /*
   * @method notify
   * @param eventName
   * @returns {_}
   */
  notify(eventName: string, ...rest: any) {
    const eventList = Events[eventName];
    if (eventList) {
      eventList.forEach(e => e.apply(this, rest));
    } else {
      toBeNotify.push({
        eventName,
        data: rest,
        scope: this,
      });
    }
    if (eventName.startsWith(`${EVENT_PREFIX}_`)) { this.unsubscribe(eventName); }
    return this;
  },
  /*
   * @param eventName
   * @param scope
   * @param data
   */
  notifyWith(eventName: string, scope: any, ...rest: any) {
    if (arguments.length < 2) { throw new TypeError('arguments error'); }
    this.notify.apply(scope, [eventName].concat(rest));
  },
  /**
   * 触发一个事件
   * @method notify
   * @param eventName 事件名称
   * @param data 事件数据 PS：现在支持变参，除了eventName,data以外还可以添加任意参数
   * @returns {Events}
   */
  notifyLike(eventNamePrefix: string, ...rest: any) {
    /* eslint-disable */
    let eventList: Function[] = [];
    for (const key in Events) {
      new RegExp(`^${eventNamePrefix}.*$`).test(key) && (eventList = eventList.concat(Events[key]));
    }
    if (eventList) {
      eventList.forEach(e => e.apply(this, rest));
    }
    return this;
    /* eslint-enable */
  },
  /*
   * @method subscribe
   * @param eventName
   * @param callback
   */
  subscribe(eventName: string, callback: Function) {
    let i = 0;
    const len = toBeNotify.length;
    if (arguments.length < 2) { throw new TypeError('arguments error '); }

    const eventList = Events[eventName] ? Events[eventName] : (Events[eventName] = []);
    if (type(callback) === Type.Array) {
      Events[eventName] = eventList.concat(callback);
    } else {
      eventList.push(callback);
    }
    for (; i < len; i += 1) {
      if (toBeNotify[i].eventName === eventName) {
        this.notify.apply(toBeNotify[i].scope, [eventName].concat(toBeNotify[i].data));
        toBeNotify.splice(i, 1);
        break;
      }
    }
    return this;
  },
  /*
   * @method unsubscribe
   * @param eventName
   */
  unsubscribe(eventName: string, callback?: Function) {
    if (callback) {
      const callbacks = Events[eventName];
      for (let i = 0; i < callbacks.length; i += 1) {
        if (callbacks[i] === callback) {
          callbacks.splice(i, 1);
          i -= 1;
        }
      }
    } else { delete Events[eventName]; }
    return this;
  },
  clear() {
    toBeNotify = [];
    Events = {};
  }
};

export default PubSub;
