
export function setUrlParam(key: string, val: string) {
  const url = toInternalUrl(document.URL);
  if (val !== undefined) {
    url.searchParams.set(key, val);
  } else {
    url.searchParams.delete(key);
  }
  const externalUrlStr = toExternalUrlStr(url);
  window.location.hash = externalUrlStr.includes('#') ? externalUrlStr.split('#')[1] : '';
}

export function toInternalUrl(externalUrlStr: string) {
  return new URL(externalUrlStr.replace('#','?'));
}

export function toExternalUrlStr(internalUrl: URL) {
  internalUrl.searchParams.sort();
  return internalUrl.href.replace('?','#');
}

export function getUrlParamsMap() {
  return getUrlParamsMapFromString(document.URL);
}

export function getUrlParamsMapFromString(urlStr: string) {
  const keyVals = new Map();
  if (!urlStr) {
    return keyVals;
  }
  const url = toInternalUrl(urlStr);
  url.searchParams.forEach(function(value, key) {
    keyVals.set(key, value);
  });
  return keyVals;

}