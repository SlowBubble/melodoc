import { fromInt, Frac } from "../fraction/fraction";
import { AccidentalEnum, InstrumentEnum, LetterEnum, NonNegativeInt, NoteGpApi, PitchApi, SongApi, SpellingApi, StaffApi, StaffTypeEnum, VoiceApi } from "./interface";

// The class itself does not need to implement SongApi, e.g. extra internal fields,
// but toApi should return an object that implements SongApi.
export class Song {
  title: string;
  staffs: Array<Staff>;
  voices: Array<Voice>;
  constructor({
    title = '',
    staffs = [],
    voices = [],
  }: SongApi) {
    this.title = title;
    this.staffs = staffs.map(obj => new Staff(obj));
    this.voices = voices.map(obj => new Voice(obj));
  }

  toApi(): SongApi {
    return this;
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
