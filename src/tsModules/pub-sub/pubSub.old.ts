/**
 * Usage:
    const [noteOnPub, noteOnSub] = pubsub.makePubSub();
    noteOnSub(data => { console.log('Received', data); });
    noteOnPub(42);
 *   
 *   
 */

export type HandlerFunc = (...args: any[]) => void;
export type SubFunc = (handlerFunc: HandlerFunc) => void;

export function makePubSub(): [HandlerFunc, SubFunc, (onOrOff: boolean) => void] {
  const evtMgr = new EvtMgr();
  return [evtMgr.pub, evtMgr.sub, evtMgr.onOffSwitch];
}

// If any of the subs recieved an event, the new sub will also receive an event. (OR)
export function makeSub(...subs: SubFunc[]) {
  const [mergedPub, mergedSub] = makePubSub();
  subs.forEach(sub => {
    sub((...args: any[]) => {
      mergedPub(...args);
    })
  });
  return mergedSub;
}

// If we call the new pub, all pubs will be called. (AND)
export function makePub(...pubs: HandlerFunc[]) {
  const [mergedPub, mergedSub] = makePubSub();
  mergedSub((...args) => {
    pubs.forEach(pub => {
      pub(...args);
    });
  });
  return mergedPub;
}

class EvtMgr {
  handlers: Array<HandlerFunc>;
  isOn: boolean;
  pub: HandlerFunc;
  sub: SubFunc;
  onOffSwitch: (onOrOff: boolean) => void;

  constructor() {
    this.handlers = [];
    this.isOn = true;

    // This weird way of defining methods is needed to support
    // the usage of passing EvtMgr.pub instead of EvtMgr into
    // other callers, so that this.handlers is defined.
    this.pub = (...args) => {
      this.handlers.forEach(handlerFunc => {
        if (this.isOn) {
          handlerFunc(...args);
        }        
      });
    }
    this.sub = handlerFunc => {
      this.handlers.push(handlerFunc);
    };
    this.onOffSwitch = onOrOff  => {
      this.isOn = onOrOff;
    }
  }
}
