import { SongApi } from "./tsModules/melodoc-api/interface";
import { Song } from "./tsModules/melodoc-api/impl";
import { MelodocEditor } from "./tsModules/melodoc-editor/editor";
import { PianoKeyboard } from "./tsModules/piano-keyboard/pianoKeyboard";
import { HotkeysMgr, makeMacHotkey } from "./tsModules/hotkeys-mgr/hotkeysMgr";

export class MelodocUi extends HTMLElement {
  editor: MelodocEditor;
  constructor() {
    super();
    this.editor = new MelodocEditor();
    const pianoKeyboard = new PianoKeyboard();
    function blah(evt: Event) {
      console.log('hi');
      evt.preventDefault();
    }

    const hotkeysMgr = new HotkeysMgr([
      makeMacHotkey('cmd enter', blah),
    ]);

    document.onkeydown = evt => {
      // Debouncing
      if (evt.repeat) {
        return;
      }
      pianoKeyboard.keyDown(evt);
      hotkeysMgr.keyDown(evt);
    }
    document.onkeyup = evt => {
      // Debouncing
      if (evt.repeat) {
        return;
      }
      pianoKeyboard.keyUp(evt);
    }

    pianoKeyboard.onNoteDown((noteNum: number) => {
      console.log(noteNum);
      // this.editor.
    });

  }

  connectedCallback() {
    // this.innerHTML = `MelodocUi`;
  }
  loadSerializedData(data: string) {
    const song = new Song(dataToSongApi(data));
    this.editor.loadSong(song);
    this.innerHTML = JSON.stringify(song, null, 2);
  }
}

function dataToSongApi(data: string): SongApi {
  try {
    const songJson: SongApi = JSON.parse(data);
    return songJson;
  } catch (err) {
    console.warn('Failed to parse this data as a song: ', data);
  }
  return {};
}