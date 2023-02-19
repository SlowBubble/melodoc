
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
}

// Keep voices and staffs separate and assign a default staff index to each VoiceApi
export interface VoiceApi {
  noteGps?: Array<NoteGpApi>,
  staffIndex?: number,
  instrument?: InstrumentApi,
}

export enum InstrumentApi {
  acoustic_grand_piano = 'acoustic_grand_piano',
}

export interface StaffApi {
  staffType?: StaffTypeApi,
}

export enum StaffTypeApi {
  treble = 'treble',
  bass = 'bass',
}

export interface NoteGpApi {
  start8n?: FractionApi,
  end8n?: FractionApi,
  pitches?: Array<PitchApi>,
}

export interface FractionApi {
  numer?: number,
  denom?: number,
}

export interface PitchApi {
  noteNum?: number,
  spelling?: SpellingApi,
}

export interface SpellingApi {
  letter?: letterApi,
  accidentals: Array<AccidentalApi>,
}

export enum AccidentalApi {
  sharp = 'sharp',
  flat = 'flat',
  natural = 'natural',
}

export enum letterApi {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
}
