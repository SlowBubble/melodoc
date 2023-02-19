import { Song } from "../melodoc-api/impl";

export class MelodocEditor {
  song: Song;
  constructor() {
    this.song = new Song({});
  }

  loadSong(song: Song) {
    this.song = song;
  }
}