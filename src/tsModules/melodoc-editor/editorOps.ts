import { NoteGpApi } from "../melodoc-api/interface";

export type EditorOperation = WriteOp
  | MoveCursorOp
  | RemoveOp
;
// TODO change the Ops into classes so that we can differentiate them
// https://stackoverflow.com/a/35728126

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
export interface WriteOp {
  noteGps: NoteGpApi[];
  voiceIdx: number;
}

// The editor will throw an error if you move the cursor inside a non-rest note.
// Need to be flexible enough to handle
// - grace note
// - moving inside a long rest.
export interface MoveCursorOp {
  // cursor: EditorCursor;

  // start8n: FracApi;
  // graceNoteGpIdx?: number;
  // voiceIdx: number;
}

// Remove noteGps to the right of the cursor
// (including grace notes that start right on the cursor).
// The cursor will automatically moved to the specify position to ensure it is in a valid position.
export interface RemoveOp {
  // cursor: EditorCursor;
}
