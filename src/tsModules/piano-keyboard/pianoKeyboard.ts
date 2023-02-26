import { HandlerFunc, makePubSub, SubFunc } from "../pub-sub/pubSub";
import { KeyMappingConfig, piano123Config } from "./keyMappingConfigs";

export class PianoKeyboard {
  onNoteDown: SubFunc<number>;
  onNoteUp: SubFunc<number>;

  protected noteDown: HandlerFunc<number>;
  protected noteUp: HandlerFunc<number>;

  // Using Definite Assignment Assertions because TS fails to detect
  // initialization from a helper function.
  protected keyToNoteNum!: Map<string, number>;
  protected keyMappingConfig!: KeyMappingConfig;

  constructor() {
    this.loadMappingConfig(piano123Config);
    [this.noteDown, this.onNoteDown] = makePubSub<number>();
    [this.noteUp, this.onNoteUp] = makePubSub<number>();
  }

  keyDown(evt: KeyboardEvent) {
    const possNoteNum = this.keyToNoteNum.get(evt.key);
    if (possNoteNum === undefined) {
      return;
    }
    this.noteDown(possNoteNum);
  }

  keyUp(evt: KeyboardEvent) {
    const possNoteNum = this.keyToNoteNum.get(evt.key);
    if (possNoteNum === undefined) {
      return;
    }
    this.noteUp(possNoteNum);
  }

  // Configuring
  loadMappingConfig(config: KeyMappingConfig) {
    this.keyMappingConfig = config;
    this.keyToNoteNum = new Map();
    config.ordering.forEach((key, index) => {
      this.keyToNoteNum.set(key, index + config.defaultStartingNoteNum);
    });
  }

  // shift() {
  // }
}