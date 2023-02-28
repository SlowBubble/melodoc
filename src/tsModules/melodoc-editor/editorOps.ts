import { Cursor, NoteGp } from "../melodoc-api/impl";
import { NoteGpApi } from "../melodoc-api/interface";

// These operations are defined as classes but should
// also be treated as public interfaces
// (i.e. should be extended with flexibility and simplicity as the priorities).
// The field types are concrete types instead of interfaces since we
// don't need to serialize/persist these operations.
// TODO Have clients use instanceof to differentiate these operations
// https://stackoverflow.com/a/35728126
export type EditorOperation = WriteOp
  | MoveCursorOp
  | RemoveOp
;

// The noteGps must be in a connected interval with no gaps.
// This should be general enough to support:
// - appending
// - overwriting
// - adding pick-up (can use rest notes as place-holder).
// Caveat 1: client need to re-enter grace notes in the start of affected interval.
// Caveat 2: The cursor will automatically move to the end of the noteGp to ensure
// it is in a valid position.
// The editor itself will ensure that no gaps exist after the operation.
// Let say WriteOp.noteGps' interval is [a, b].
// Existing NoteGps with start < a and end > a will be truncated (end --> a).
// Existing NoteGps with start >= a and < b will be removed and any gaps will
// be filled in a rest.
// The reason we are doing NoteGp[] instead of NoteGp is to handle insertion of
// multiple grace notes. 
export class WriteOp {
  noteGps: NoteGp[];
  voiceIdx: number;
  constructor({
    noteGps = [],
    voiceIdx = 0,
  }) {
    this.noteGps = noteGps;
    this.voiceIdx = voiceIdx;
  }
}

// The editor will throw an error if you move the cursor inside a non-rest note.
// Need to be flexible enough to handle
// - grace note
// - moving inside a long rest.
export interface MoveCursorOp {
  cursor: Cursor;
}

// Remove noteGps to the right of the cursor
// (including grace notes that start right on the cursor).
// The cursor will automatically moved to the specify position to ensure it is in a valid position.
export interface RemoveOp {
  cursor: Cursor;
}
