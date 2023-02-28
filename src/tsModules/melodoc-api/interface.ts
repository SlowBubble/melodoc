
// This API is designed to be
// - self-contained
// - hopefully general enough to not require fixing corner cases (e.g. accidentals)
// - extensible (e.g. add fields in NoteGpApi to alter it for grace note).

// Note: Please make all fields optional so that {} can be the zero value for this.
// The actual default/zero values will be set in the implementation.

// Possible future extension:
// - Allow overriding the staff index for certain NoteGpApi instances?
// - voices?: Array<VoiceApi | DrumVoiceApi>, using drumKeys instead of pitches.

export interface SongApi {
  title?: string,
  staffs?: Array<StaffApi>,
  voices?: Array<VoiceApi>,
  // Helps with sharing the relevant location in a longer piece.
  cursor?: CursorApi,
  // Helps with sharing the relevant region in a longer piece.
  selections?: Array<SelectionApi>
}

// startCursor and endCursor needs to have the same voiceIdx.
export interface SelectionApi {
  startCursor?: CursorApi;
  endCursor?: CursorApi;
}

export interface CursorApi {
  voiceIdx?: number;
  time8n?: FractionApi;
  graceNoteGpIdx?: number;
}

// Keep voices and staffs separate and assign a default staff index to each VoiceApi
export interface VoiceApi {
  noteGps?: Array<NoteGpApi>,
  staffIndex?: NonNegativeInt,
  instrument?: InstrumentEnum,
}

export enum InstrumentEnum {
  acoustic_grand_piano = 'acoustic_grand_piano',
}

export interface StaffApi {
  staffType?: StaffTypeEnum,
}

export enum StaffTypeEnum {
  treble = 'treble',
  bass = 'bass',
}

export interface NoteGpApi {
  start8n?: FractionApi,
  end8n?: FractionApi,
  pitches?: Array<PitchApi>,
}

export interface FractionApi {
  numer?: Int,
  denom?: PositiveInt,
}

export interface PitchApi {
  noteNum?: NonNegativeInt,
  spelling?: SpellingApi,
}

export interface SpellingApi {
  letter?: LetterEnum,
  accidentals?: Array<AccidentalEnum>,
}

export enum AccidentalEnum {
  sharp = 'sharp',
  flat = 'flat',
  natural = 'natural',
}

export enum LetterEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
}

export type Int = number;
export type NonNegativeInt = number;
export type PositiveInt = number;
