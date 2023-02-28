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
        constructor({ title = '', staffs = [], voices = [], cursor = undefined, selections = [], }) {
            this.title = title;
            this.staffs = staffs.map(obj => new Staff(obj));
            this.voices = voices.map(obj => new Voice(obj));
            this.cursor = cursor ? new Cursor(cursor) : undefined;
            this.selections = selections.map(obj => new Selection(obj));
        }
        toApi() {
            return this;
        }
    }
    class Selection {
        constructor({ startCursor = new Cursor({}), endCursor = new Cursor({}), }) {
            this.startCursor = new Cursor(startCursor);
            this.endCursor = new Cursor(endCursor);
        }
    }
    class Cursor {
        constructor({ voiceIdx = 0, time8n = fromInt(0), graceNoteGpIdx = 0, }) {
            this.time8n = new Frac(time8n);
            this.graceNoteGpIdx = graceNoteGpIdx;
            this.voiceIdx = voiceIdx;
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
        write(op) {
        }
    }

    /**
     * Note that this only supports 1 arg for the HandlerFunc.
     * Usage:
        const [noteOnPub, noteOnSub] = pubsub.makePubSub<number>();
        noteOnSub((data: number) => { console.log('Received', data); });
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
            this.pub = (arg) => {
                this.handlers.forEach(handlerFunc => {
                    if (this.isOn) {
                        handlerFunc(arg);
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

    function deepEqual(x, y) {
        const ok = Object.keys, tx = typeof x, ty = typeof y;
        return x && y && tx === 'object' && tx === ty ? (ok(x).length === ok(y).length &&
            ok(x).every((key) => deepEqual(x[key], y[key]))) : (x === y);
    }

    const keyToCodeMapping = new Map([
        // Nav/control
        ['esc', 'Escape'],
        ['caps', 'CapsLock'],
        ['backspace', 'Backspace'],
        ['tab', 'Tab'],
        ['left', 'ArrowLeft'],
        ['right', 'ArrowRight'],
        ['down', 'ArrowDown'],
        ['up', 'ArrowUp'],
        ['enter', 'Enter'],
        // Not universal
        ['home', 'Home'],
        ['end', 'End'],
        ['pageup', 'PageUp'],
        ['pagedown', 'PageDown'],
        // Numeric
        ['1', 'Digit1'],
        ['2', 'Digit2'],
        ['3', 'Digit3'],
        ['4', 'Digit4'],
        ['5', 'Digit5'],
        ['6', 'Digit6'],
        ['7', 'Digit7'],
        ['8', 'Digit8'],
        ['9', 'Digit9'],
        ['0', 'Digit0'],
        // Symbols
        ['`', 'Backquote'],
        ['-', 'Minus'],
        ['=', 'Equal'],
        // Letters
        ['a', 'KeyA'],
        ['b', 'KeyB'],
        ['c', 'KeyC'],
        ['d', 'KeyD'],
        ['e', 'KeyE'],
        ['f', 'KeyF'],
        ['g', 'KeyG'],
        ['h', 'KeyH'],
        ['i', 'KeyI'],
        ['j', 'KeyJ'],
        ['k', 'KeyK'],
        ['l', 'KeyL'],
        ['m', 'KeyM'],
        ['n', 'KeyN'],
        ['o', 'KeyO'],
        ['p', 'KeyP'],
        ['q', 'KeyQ'],
        ['r', 'KeyR'],
        ['s', 'KeyS'],
        ['t', 'KeyT'],
        ['u', 'KeyU'],
        ['v', 'KeyV'],
        ['w', 'KeyW'],
        ['x', 'KeyX'],
        ['y', 'KeyY'],
        ['z', 'KeyZ'],
    ]);
    // 0x001A	"BracketLeft"	"BracketLeft"
    // 0x001B	"BracketRight"	"BracketRight"
    // 0x001C	"Enter"	"Enter"
    // 0x001D	"ControlLeft"	"ControlLeft"
    // 0x001E	"KeyA"	"KeyA"
    // 0x001F	"KeyS"	"KeyS"
    // 0x0020	"KeyD"	"KeyD"
    // 0x0021	"KeyF"	"KeyF"
    // 0x0022	"KeyG"	"KeyG"
    // 0x0023	"KeyH"	"KeyH"
    // 0x0024	"KeyJ"	"KeyJ"
    // 0x0025	"KeyK"	"KeyK"
    // 0x0026	"KeyL"	"KeyL"
    // 0x0027	"Semicolon"	"Semicolon"
    // 0x0028	"Quote"	"Quote"
    // 0x0029	"Backquote"	"Backquote"
    // 0x002A	"ShiftLeft"	"ShiftLeft"
    // 0x002B	"Backslash"	"Backslash"
    // 0x002C	"KeyZ"	"KeyZ"
    // 0x002D	"KeyX"	"KeyX"
    // 0x002E	"KeyC"	"KeyC"
    // 0x002F	"KeyV"	"KeyV"
    // 0x0030	"KeyB"	"KeyB"
    // 0x0031	"KeyN"	"KeyN"
    // 0x0032	"KeyM"	"KeyM"
    // 0x0033	"Comma"	"Comma"
    // 0x0034	"Period"	"Period"
    // 0x0035	"Slash"	"Slash"
    // 0x0036	"ShiftRight"	"ShiftRight"
    // 0x0037	"NumpadMultiply"	"NumpadMultiply"
    // 0x0038	"AltLeft"	"AltLeft"
    // 0x0039	"Space"	"Space"
    // 0x003A	"CapsLock"	"CapsLock"

    // TODO see if it's easy to create a helper to
    // cmd will be translated to ctrl for non-Mac OS.
    // Usage "cmd a", "shift alt b"
    function makeMacHotkey(hotkeyStr, handler) {
        const errMsg = 'Unable to parse: ' + hotkeyStr;
        const keys = hotkeyStr.toLowerCase().split(/[\+\s]/);
        const finalKey = keys[keys.length - 1];
        const possCode = keyToCodeMapping.get(finalKey);
        if (!possCode) {
            // warn before throwing to get a more accurate stack trace.
            console.warn(errMsg);
            throw errMsg;
        }
        const keyInfo = new KeyInfo({ code: possCode });
        keys.slice(0, keys.length - 1).forEach(key => {
            switch (key) {
                case 'cmd':
                    // TODO handle non-mac.
                    keyInfo.metaKey = true;
                    return;
                case 'ctrl':
                    // TODO handle non-mac.
                    keyInfo.ctrlKey = true;
                    return;
                case 'alt':
                    keyInfo.altKey = true;
                    return;
                case 'shift':
                    keyInfo.shiftKey = true;
                default:
                    console.warn(errMsg);
                    throw errMsg;
            }
        });
        return new HotkeyInfo(keyInfo, evt => handler(evt));
    }
    // The reason for having a function with no default is to
    // ensure we are only adding fields that are a subset of KeyboardEvent
    function makeKeyInfoWithoutDefault({ code, metaKey, ctrlKey, altKey, shiftKey, }) {
        return new KeyInfo({
            code,
            metaKey,
            ctrlKey,
            altKey,
            shiftKey,
        });
    }
    class KeyInfo {
        constructor({ code, metaKey = false, ctrlKey = false, altKey = false, shiftKey = false, }) {
            this.code = code;
            this.metaKey = metaKey;
            this.ctrlKey = ctrlKey;
            this.altKey = altKey;
            this.shiftKey = shiftKey;
        }
        // This provides the canonical ordering and representation
        // of the KeyInfo.
        toString() {
            let strBuf = [];
            if (this.ctrlKey) {
                strBuf.push('ctrl');
            }
            if (this.metaKey) {
                strBuf.push('cmd');
            }
            if (this.altKey) {
                strBuf.push('alt');
            }
            if (this.shiftKey) {
                strBuf.push('shift');
            }
            strBuf.push(this.code);
            return strBuf.join(' ');
        }
        equals(that) {
            return deepEqual(this, that);
        }
    }
    class HotkeyInfo {
        constructor(keyInfo, handler) {
            this.keyInfo = keyInfo;
            this.handler = handler;
        }
    }
    class HotkeysMgr {
        constructor(hotkeyInfos) {
            this.keyInfoStrToHandler = new Map();
            hotkeyInfos === null || hotkeyInfos === void 0 ? void 0 : hotkeyInfos.forEach(info => this.addShortcut(info));
        }
        addShortcut(info) {
            this.keyInfoStrToHandler.set(info.keyInfo.toString(), info.handler);
        }
        keyDown(evt) {
            const evtKeyInfoStr = makeKeyInfoWithoutDefault(evt).toString();
            const possHandler = this.keyInfoStrToHandler.get(evtKeyInfoStr);
            if (possHandler) {
                possHandler(evt);
            }
        }
    }

    class MelodocUi extends HTMLElement {
        constructor() {
            super();
            this.editor = new MelodocEditor();
            const pianoKeyboard = new PianoKeyboard();
            function blah(evt) {
                console.log('hi');
                evt.preventDefault();
            }
            const hotkeysMgr = new HotkeysMgr([
                makeMacHotkey('cmd enter', blah),
            ]);
            document.onkeydown = evt => {
                // Debouncing
                if (evt.repeat) {
                    return;
                }
                pianoKeyboard.keyDown(evt);
                hotkeysMgr.keyDown(evt);
            };
            document.onkeyup = evt => {
                // Debouncing
                if (evt.repeat) {
                    return;
                }
                pianoKeyboard.keyUp(evt);
            };
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
