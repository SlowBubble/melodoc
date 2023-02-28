
// TODO see if it's easy to create a helper to
// convert KeyboardEvent into KeyInfo.

import { deepEqual } from "../deep-equal/deep-equal";
import { keyToCodeMapping } from "./keyToCode";

export type HotkeyHandler = (KeyboardEvent) => void;
// cmd will be translated to ctrl for non-Mac OS.
// Usage "cmd a", "shift alt b"
export function makeMacHotkey(hotkeyStr: string, handler: HotkeyHandler) {
  const errMsg = 'Unable to parse: ' + hotkeyStr;
  const keys = hotkeyStr.toLowerCase().split(/[\+\s]/);
  const finalKey = keys[keys.length - 1];
  const possCode = keyToCodeMapping.get(finalKey);
  if (!possCode) {
    // warn before throwing to get a more accurate stack trace.
    console.warn(errMsg);
    throw errMsg;
  }
  const keyInfo = new KeyInfo({code: possCode});
  keys.slice(0, keys.length - 1).forEach(key => {
    switch (key) {
      case 'cmd':
        // TODO handle non-mac.
        keyInfo.metaKey = true;
        return;
      case 'ctrl':
        // TODO handle non-mac.
        keyInfo.ctrlKey = true;
        return;
      case 'alt':
        keyInfo.altKey = true;
        return;
      case 'shift':
        keyInfo.shiftKey = true;
      default:
        console.warn(errMsg);
        throw errMsg;
    }
  });
  return new HotkeyInfo(keyInfo, evt => handler(evt));
}

// The reason for having a function with no default is to
// ensure we are only adding fields that are a subset of KeyboardEvent
function makeKeyInfoWithoutDefault({
    code,
    metaKey,
    ctrlKey,
    altKey,
    shiftKey,
  }) {
  return new KeyInfo({
    code,
    metaKey,
    ctrlKey,
    altKey,
    shiftKey,
  });
}

export class KeyInfo {
  code: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;

  constructor({
    code,
    metaKey = false,
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
  }) {
    this.code = code;
    this.metaKey = metaKey;
    this.ctrlKey = ctrlKey;
    this.altKey = altKey;
    this.shiftKey = shiftKey;
  }

  // This provides the canonical ordering and representation
  // of the KeyInfo.
  toString() {
    let strBuf: string[] = [];
    if (this.ctrlKey) {
      strBuf.push('ctrl');
    }
    if (this.metaKey) {
      strBuf.push('cmd');
    }
    if (this.altKey) {
      strBuf.push('alt');
    }
    if (this.shiftKey) {
      strBuf.push('shift');
    }
    strBuf.push(this.code)
    return strBuf.join(' ');
  }
  equals(that: KeyInfo) {
    return deepEqual(this, that);
  }
}

export class HotkeyInfo {
  keyInfo: KeyInfo;
  handler: HotkeyHandler;
  constructor(keyInfo: KeyInfo, handler: HotkeyHandler) {
    this.keyInfo = keyInfo;
    this.handler = handler;
  }
}

export class HotkeysMgr {
  keyInfoStrToHandler: Map<string, HotkeyHandler>;
  constructor(hotkeyInfos?: HotkeyInfo[]) {
    this.keyInfoStrToHandler = new Map();
    hotkeyInfos?.forEach(info => this.addShortcut(info));
  }

  addShortcut(info: HotkeyInfo) {
    this.keyInfoStrToHandler.set(info.keyInfo.toString(), info.handler);
  }

  keyDown(evt: KeyboardEvent) {
    const evtKeyInfoStr = makeKeyInfoWithoutDefault(evt).toString();
    const possHandler = this.keyInfoStrToHandler.get(evtKeyInfoStr);
    if (possHandler) {
      possHandler(evt);
    }
  }
}