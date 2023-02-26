(function () {
    'use strict';

    function fromInt(numer) {
        return new Frac({ numer: numer, denom: 1 });
    }
    class Frac {
        constructor({ numer = 0, denom = 1 }) {
            if (denom == 0) {
                throw new Error("denominator must be non-zero.");
            }
            // Obtaining a unique rep.
            if (denom < 0) {
                numer = -numer;
                denom = -denom;
            }
            const gcd = computeGcd(numer, denom);
            this.numer = numer / gcd;
            this.denom = denom / gcd;
        }
        getDenom() {
            return this.denom;
        }
        getNumer() {
            return this.numer;
        }
        isWhole() {
            return this.denom === 1;
        }
        plus(f2) {
            const f1 = this;
            return new Frac({
                numer: f1.numer * f2.denom + f2.numer * f1.denom,
                denom: f1.denom * f2.denom,
            });
        }
        minus(f2) {
            const f1 = this;
            return f1.plus(f2.negative());
        }
        times(f2) {
            const f1 = this;
            return new Frac({
                numer: f1.numer * f2.numer,
                denom: f1.denom * f2.denom,
            });
        }
        over(f2) {
            const f1 = this;
            return new Frac({
                numer: f1.numer * f2.denom,
                denom: f1.denom * f2.numer,
            });
        }
        negative() {
            return new Frac({
                numer: -this.numer,
                denom: this.denom,
            });
        }
        toString() {
            return `${this.numer}/${this.denom}`;
        }
        toFloat() {
            return this.numer / this.denom;
        }
        equals(frac2) {
            return this.numer === frac2.numer && this.denom === frac2.denom;
        }
        lessThan(frac2) {
            // Assumes that denom is > 0 always.
            return this.numer * frac2.denom < frac2.numer * this.denom;
        }
        leq(frac2) {
            return this.lessThan(frac2) || this.equals(frac2);
        }
        geq(frac2) {
            return !this.lessThan(frac2);
        }
        greaterThan(frac2) {
            return !this.leq(frac2);
        }
        weaklyInside(left, right) {
            return left.leq(this) && this.leq(right);
        }
        strictlyInside(left, right) {
            return left.lessThan(this) && this.lessThan(right);
        }
        fractionalPart() {
            return this.minus(fromInt(this.wholePart()));
        }
        wholePart() {
            return Math.floor(this.toFloat());
        }
    }
    function computeGcd(x, y) {
        x = Math.abs(x);
        y = Math.abs(y);
        while (y) {
            var t = y;
            y = x % y;
            x = t;
        }
        return x;
    }

    // This API is designed to be
    // - self-contained
    // - hopefully general enough to not require fixing corner cases (e.g. accidentals)
    // - extensible (e.g. add fields in NoteGpApi to alter it for grace note).
    var InstrumentEnum;
    (function (InstrumentEnum) {
        InstrumentEnum["acoustic_grand_piano"] = "acoustic_grand_piano";
    })(InstrumentEnum || (InstrumentEnum = {}));
    var StaffTypeEnum;
    (function (StaffTypeEnum) {
        StaffTypeEnum["treble"] = "treble";
        StaffTypeEnum["bass"] = "bass";
    })(StaffTypeEnum || (StaffTypeEnum = {}));
    var AccidentalEnum;
    (function (AccidentalEnum) {
        AccidentalEnum["sharp"] = "sharp";
        AccidentalEnum["flat"] = "flat";
        AccidentalEnum["natural"] = "natural";
    })(AccidentalEnum || (AccidentalEnum = {}));
    var LetterEnum;
    (function (LetterEnum) {
        LetterEnum["A"] = "A";
        LetterEnum["B"] = "B";
        LetterEnum["C"] = "C";
        LetterEnum["D"] = "D";
        LetterEnum["E"] = "E";
        LetterEnum["F"] = "F";
        LetterEnum["G"] = "G";
    })(LetterEnum || (LetterEnum = {}));

    // The class itself does not need to implement SongApi, e.g. extra internal fields,
    // but toApi should return an object that implements SongApi.
    class Song {
        constructor({ title = '', staffs = [], voices = [], }) {
            this.title = title;
            this.staffs = staffs.map(obj => new Staff(obj));
            this.voices = voices.map(obj => new Voice(obj));
        }
        toApi() {
            return this;
        }
    }
    class Staff {
        constructor({ staffType = StaffTypeEnum.treble, }) {
            this.staffType = staffType;
        }
    }
    class Voice {
        constructor({ noteGps = [], staffIndex = 0, instrument = InstrumentEnum.acoustic_grand_piano, }) {
            this.noteGps = noteGps.map(obj => new NoteGp(obj));
            this.staffIndex = staffIndex;
            this.instrument = instrument;
        }
    }
    class NoteGp {
        constructor({ start8n = fromInt(0), end8n = fromInt(0), pitches = [], }) {
            this.start8n = new Frac(start8n);
            this.end8n = new Frac(end8n);
            this.pitches = pitches.map(obj => new Pitch(obj));
        }
    }
    class Pitch {
        constructor({ noteNum = 0, spelling = {}, }) {
            this.noteNum = noteNum;
            this.spelling = new Spelling(spelling);
        }
    }
    class Spelling {
        constructor({ letter = LetterEnum.C, accidentals = [], }) {
            this.letter = letter;
            this.accidentals = accidentals;
        }
    }

    class MelodocEditor {
        constructor() {
            this.song = new Song({});
        }
        loadSong(song) {
            this.song = song;
        }
    }

    /**
     * Usage:
        const [noteOnPub, noteOnSub] = pubsub.makePubSub();
        noteOnSub(data => { console.log('Received', data); });
        noteOnPub(42);
     *
     *
     */
    function makePubSub() {
        const evtMgr = new EvtMgr();
        return [evtMgr.pub, evtMgr.sub, evtMgr.onOffSwitch];
    }
    class EvtMgr {
        constructor() {
            this.handlers = [];
            this.isOn = true;
            // This weird way of defining methods is needed to support
            // the usage of passing EvtMgr.pub instead of EvtMgr into
            // other callers, so that this.handlers is defined.
            this.pub = (...args) => {
                this.handlers.forEach(handlerFunc => {
                    if (this.isOn) {
                        handlerFunc(...args);
                    }
                });
            };
            this.sub = handlerFunc => {
                this.handlers.push(handlerFunc);
            };
            this.onOffSwitch = onOrOff => {
                this.isOn = onOrOff;
            };
        }
    }

    class DebouncedKeyboard {
        constructor() {
            this.enabled = true;
            this.keyDownCodes = new Set();
            [this.debouncedKeyDown, this.onDebouncedKeyDown] = makePubSub();
            [this.debouncedKeyUp, this.onDebouncedKeyUp] = makePubSub();
        }
        keyDown(evt) {
            if (this.keyDownCodes.has(evt.code)) {
                return;
            }
            this.keyDownCodes.add(evt.code);
            this.debouncedKeyDown(evt);
        }
        keyUp(evt) {
            this.keyDownCodes.delete(evt.code);
            if (!this.enabled) {
                return;
            }
            this.debouncedKeyUp(evt);
        }
    }

    const piano123Config = {
        defaultStartingNoteNum: 47,
        ordering: [
            '`',
            '1',
            'q',
            '2',
            'w',
            '3',
            '4',
            'r',
            '5',
            't',
            '6',
            'y',
            '7',
            '8',
            'i',
            '9',
            'o',
            '0',
            '-',
            '[',
            '=',
            ']',
            "'",
            '/',
            ';',
            'l',
            ',',
            'k',
            'm',
            'j',
            'h',
            'b',
            'g',
            'v',
            'f',
            'c',
            'd',
            's',
            'z',
            'a',
        ],
    };

    class PianoKeyboard {
        constructor() {
            this.loadMappingConfig(piano123Config);
            [this.noteDown, this.onNoteDown] = makePubSub();
            [this.noteUp, this.onNoteUp] = makePubSub();
        }
        keyDown(evt) {
            const possNoteNum = this.keyToNoteNum.get(evt.key);
            if (possNoteNum === undefined) {
                return;
            }
            this.noteDown(possNoteNum);
        }
        keyUp(evt) {
            const possNoteNum = this.keyToNoteNum.get(evt.key);
            if (possNoteNum === undefined) {
                return;
            }
            this.noteUp(possNoteNum);
        }
        // Configuring
        loadMappingConfig(config) {
            this.keyMappingConfig = config;
            this.keyToNoteNum = new Map();
            config.ordering.forEach((key, index) => {
                this.keyToNoteNum.set(key, index + config.defaultStartingNoteNum);
            });
        }
    }

    class MelodocUi extends HTMLElement {
        constructor() {
            super();
            this.editor = new MelodocEditor();
            const debouncedKeyboard = new DebouncedKeyboard();
            document.onkeydown = evt => {
                debouncedKeyboard.keyDown(evt);
            };
            document.onkeyup = evt => {
                debouncedKeyboard.keyUp(evt);
            };
            const pianoKeyboard = new PianoKeyboard();
            debouncedKeyboard.onDebouncedKeyDown((evt) => {
                pianoKeyboard.keyDown(evt);
            });
            debouncedKeyboard.onDebouncedKeyUp((evt) => {
                pianoKeyboard.keyUp(evt);
            });
            pianoKeyboard.onNoteDown((noteNum) => {
                console.log(noteNum);
                // this.editor.
            });
        }
        connectedCallback() {
            // this.innerHTML = `MelodocUi`;
        }
        loadSerializedData(data) {
            const song = new Song(dataToSongApi(data));
            this.editor.loadSong(song);
            this.innerHTML = JSON.stringify(song, null, 2);
        }
    }
    function dataToSongApi(data) {
        try {
            const songJson = JSON.parse(data);
            return songJson;
        }
        catch (err) {
            console.warn('Failed to parse this data as a song: ', data);
        }
        return {};
    }

    function main(data) {
        customElements.define("melodoc-ui", MelodocUi);
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = '';
        const melodocUi = document.createElement('melodoc-ui');
        mainDiv.appendChild(melodocUi);
        melodocUi.loadSerializedData(data);
    }

    main('google');

})();
//# sourceMappingURL=googleAddOnMain.js.map
