import { SongApi } from "./tsModules/melodoc-api/interface";
import { Song } from "./tsModules/melodoc-api/impl";
import { MelodocEditor } from "./tsModules/melodoc-editor/editor";
import { DebouncedKeyboard } from "./debouncedKeyboard";
import { PianoKeyboard } from "./tsModules/piano-keyboard/pianoKeyboard";

export class MelodocUi extends HTMLElement {
  editor: MelodocEditor;
  constructor() {
    super();
    this.editor = new MelodocEditor();

    const debouncedKeyboard = new DebouncedKeyboard();
    document.onkeydown = evt => {
      debouncedKeyboard.keyDown(evt);
    }
    document.onkeyup = evt => {
      debouncedKeyboard.keyUp(evt);
    }

    const pianoKeyboard = new PianoKeyboard();
    debouncedKeyboard.onDebouncedKeyDown((evt: KeyboardEvent) => {
      pianoKeyboard.keyDown(evt);
    });
    debouncedKeyboard.onDebouncedKeyUp((evt: KeyboardEvent) => {
      pianoKeyboard.keyUp(evt);
    });
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