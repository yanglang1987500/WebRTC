import { Type } from "@common/enums/base";

const getType = (obj: any) => {
  const type = Object.prototype.toString.call(obj);
  return type.substring(8, type.length - 1);
};

const mapping: IMapping = {
  post: {},
  get: {}
};

interface IMapping {
  post: IMappingValue;
  get: IMappingValue;
}

interface IMappingValue {
  [url: string]: IMappingValueData;
}

interface IMappingValueData {
  exact: boolean;
  data: any;
}

const matchUrl = (originUrl: string, mapping: IMappingValue): IMappingValueData => {
  let result = null;
  Object.keys(mapping).some((url: string) => {
    const data = mapping[url];
    if (data.exact && url === originUrl) {
      result = data;
      return true;
    }
    if (!data.exact && new RegExp(`^${url}.*`).test(originUrl)) {
      result = data;
      return true;
    }
    return false;
  });
  return result;
};

const fetch = (type: 'get' | 'post') => (url: string, param?: any) => {
  const match = matchUrl(url, mapping[type]);
  if (match && match.data && match.data.then) {
    return match.data;
  }
  return new Promise(resolve => {
    resolve({ data: match ? (getType(match.data) === Type.Function ? match.data(param) : match.data) : {} });
  });
};

export const main = {
  fetchGet: fetch('get'),
  fetchPost: fetch('post')
};

const axiosObj = {
  create: function () {
    return {
      get: (url: string, param: any) => main.fetchGet(url, param),
      post: (url: string, param: any) => main.fetchPost(url, param),
      interceptors: {
        response: {
          use: () => { }
        },
        request: {
          use: () => { }
        }
      }
    };
  },
};

export const setPostUrlData = (url: string, data: any, exact?: boolean) => mapping.post[url] = { data, exact };

export const setGetUrlData = (url: string, data: any, exact?: boolean) => mapping.get[url] = { data, exact };

export default axiosObj;