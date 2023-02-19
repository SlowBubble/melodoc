import { SongApi } from "./tsModules/melodoc-api/interface";
import { Song } from "./tsModules/melodoc-api/impl";
import { MelodocEditor } from "./tsModules/melodoc-editor/editor";

export class MelodocUi extends HTMLElement {
  editor: MelodocEditor;
  constructor() {
    super();
    this.editor = new MelodocEditor();
  }
  connectedCallback() {
    this.innerHTML = `MelodocUi`;
  }
  loadSerializedData(data: string) {
    const song = new Song(dataToSongApi(data));
    this.editor.loadSong(song);
    this.innerHTML = data;
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