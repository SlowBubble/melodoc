import { SongApi } from "./interface";

// Top-level public structure for Melodoc.

export class Song {
  title: string;
  constructor({
    title = '',
  }: SongApi) {
    this.title = title;
  }
}


// export class Voice {
//   constructor({
//     noteGps = [],
//     staffType = StaffType.Treble,
//   }) {

//   }
// }

// export const StaffType = {
//   Treble: 'Treble',
//   Bass: 'Bass',
// };

// export class NoteGp {
//   constructor({
//     start8n,
//     end8n,
//     pitches = [],
//     // optional
//     accented,
//   }) {

//   }
// }

// export class Pitch {
//   constructor({
//     noteNum = 60,
//     spelling,
//   }) {

//   }
// }

// export class ChordChange {
//   constructor({
//     start8n,
//     // No validation here.
//     // Interpretation is left for the client.
//     chordString,
//   }) {

//   }
// }
