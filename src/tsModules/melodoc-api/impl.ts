import { fromInt, Frac } from "../fraction/fraction";
import { AccidentalEnum, CursorApi, InstrumentEnum, LetterEnum, NonNegativeInt, NoteGpApi, PitchApi, SelectionApi, SongApi, SpellingApi, StaffApi, StaffTypeEnum, VoiceApi } from "./interface";

// The class itself does not need to implement SongApi, e.g. extra internal fields,
// but toApi should return an object that implements SongApi.
export class Song {
  title: string;
  staffs: Array<Staff>;
  voices: Array<Voice>;
  // Optional because a song doesn't need a cursor.
  cursor?: Cursor;
  selections: Array<Selection>;
  constructor({
    title = '',
    staffs = [],
    voices = [],
    cursor = undefined,
    selections = [],
  }: SongApi) {
    this.title = title;
    this.staffs = staffs.map(obj => new Staff(obj));
    this.voices = voices.map(obj => new Voice(obj));
    this.cursor = cursor ? new Cursor(cursor) : undefined;
    this.selections = selections.map(obj => new Selection(obj));
  }

  toApi(): SongApi {
    return this;
  }
}

export class Selection {
  startCursor: Cursor;
  endCursor: Cursor;
  constructor({
    startCursor = new Cursor({}),
    endCursor = new Cursor({}),
  }: SelectionApi) {
    this.startCursor = new Cursor(startCursor);
    this.endCursor = new Cursor(endCursor);
  }
}

export class Cursor {
  voiceIdx: number;
  time8n: Frac;
  graceNoteGpIdx: number;
  constructor({
    voiceIdx = 0,
    time8n = fromInt(0),
    graceNoteGpIdx = 0,
  }: CursorApi) {
    this.time8n = new Frac(time8n);
    this.graceNoteGpIdx = graceNoteGpIdx;
    this.voiceIdx = voiceIdx;
  }
}

export class Staff {
  staffType: StaffTypeEnum;
  constructor({
    staffType = StaffTypeEnum.treble,
  }: StaffApi) {
    this.staffType = staffType;
  }
}

export class Voice {
  noteGps: NoteGp[];
  staffIndex: NonNegativeInt;
  instrument: InstrumentEnum;
  constructor({
    noteGps = [],
    staffIndex = 0,
    instrument = InstrumentEnum.acoustic_grand_piano,
  }: VoiceApi) {
    this.noteGps = noteGps.map(obj => new NoteGp(obj));
    this.staffIndex = staffIndex;
    this.instrument = instrument;
  }
}

export class NoteGp {
  start8n: Frac;
  end8n: Frac;
  pitches: Pitch[];
  constructor({
    start8n = fromInt(0),
    end8n = fromInt(0),
    pitches = [],
  }: NoteGpApi) {
    this.start8n = new Frac(start8n);
    this.end8n = new Frac(end8n);
    this.pitches = pitches.map(obj => new Pitch(obj));
  }
}

export class Pitch {
  noteNum: NonNegativeInt;
  spelling: Spelling;
  constructor({
    noteNum = 0,
    spelling = {},
  }: PitchApi) {
    this.noteNum = noteNum;
    this.spelling = new Spelling(spelling);
  }
}

export class Spelling {
  letter: LetterEnum;
  accidentals: AccidentalEnum[];
  constructor({
    letter = LetterEnum.C,
    accidentals = [],
  }: SpellingApi) {
    this.letter = letter;
    this.accidentals = accidentals;
  }
}
