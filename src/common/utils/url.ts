import { pickBy } from "lodash-es";

export const decodeURLParams = (search: string): { [key: string]: string } => {
  if (search.indexOf("?") <= -1) return {};
  const hashes = search.slice(search.indexOf("?") + 1).split("&");
  return hashes.reduce(
    (params, hash) => {
      const split = hash.indexOf("=");

      if (split < 0) {
        return Object.assign(params, {
          [hash]: null
        });
      }

      const key = hash.slice(0, split);
      const val = hash.slice(split + 1);

      return Object.assign(params, { [key]: decodeURIComponent(val) });
    },
    {} as any
  );
};

// obj => a=b&c=d;
export const objectToUrlQuery = (obj: any) => {
  const fn = (all: string, prop: string) => {
    return `${all.length ? `${all}&` : all}${prop}=${obj[prop]}`;
  };
  return `${Object.keys(obj).reduce(fn, "")}`;
};

export function parseURL(url: string) {
  const a = document.createElement("a");
  a.href = url;
  return {
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (() => {
      // tslint:disable-next-line: one-variable-per-declaration
      const ret: any = {},
        seg = a.search.replace(/^\?/, "").split("&"),
        len = seg.length;
      // tslint:disable-next-line: one-variable-per-declaration
      let i = 0,
        s;
      for (; i < len; i += 1) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split("=");
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    hash: a.hash.replace("#", "")
  };
}

export function currentPageHashToReturnUrl(): string {
  const hash = `${location.hash.slice(2)}`;
  const pathnameRaw = hash.match(/([^?]*)/)[1];
  const params = parseURL(hash).params;
  params["returnUrl"] = pathnameRaw;
  const url = Object.keys(params).length ? `?${objectToUrlQuery(params)}` : "";
  return url;
}

export function loginPageHashToRedirectUrl() {
  const params = decodeURLParams(window.location.href);
  if (params.returnUrl && params.returnUrl.startsWith("account")) {
    delete params.returnUrl;
  }
  const filterParams = pickBy(params, (value, key) => {
    return !!value && key !== "returnUrl";
  });
  let otherQuery = objectToUrlQuery(filterParams);
  otherQuery = otherQuery.length ? `?${otherQuery}` : "";
  const url = params.returnUrl ? `${params.returnUrl}${otherQuery}` : "";
  return url;
}
