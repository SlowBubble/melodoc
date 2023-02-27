
// TODO see if it's easy to create a helper to
// convert KeyboardEvent into KeyInfo.

import { deepEqual } from "../deep-equal/deep-equal";
import { keyToCodeMapping } from "./keyToCode";

export type HotkeyHandler = (KeyboardEvent) => void;
// cmd will be translated to ctrl for non-Mac OS.
// Usage "cmd+a", "shift+alt+b"
export function makeMacHotkey(hotkeyStr: string, handler: HotkeyHandler) {
  const errMsg = 'Unable to parse: ' + hotkeyStr;
  const keys = hotkeyStr.toLowerCase().split('+');
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

export class KeyInfo {
  code: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;

  constructor({
    code = '',
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
  hotkeyInfos: HotkeyInfo[];
  constructor(hotkeyInfos?: HotkeyInfo[]) {
    this.hotkeyInfos = hotkeyInfos || [];
  }

  addShortcut(info: HotkeyInfo) {
    this.hotkeyInfos.push(info);
  }

  keyDown(evt: KeyboardEvent) {
    this.hotkeyInfos.forEach(hotkeyInfo => {
      if (hotkeyInfo.keyInfo.equals(new KeyInfo(evt))) {
        hotkeyInfo.handler(evt);
      }
    });
  }
}