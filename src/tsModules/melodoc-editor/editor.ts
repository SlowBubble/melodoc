import { Song } from "../melodoc-api/impl";
import { WriteOp } from "./editorOps";

export class MelodocEditor {
  song: Song;
  constructor() {
    this.song = new Song({});
  }

  loadSong(song: Song) {
    this.song = song;
  }

  write(op: WriteOp) {

  }
}