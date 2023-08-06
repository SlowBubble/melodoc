(function () {
    'use strict';

    const codeToHotkey = new Map([
        ["Escape", "esc"],
        ["CapsLock", "caps"],
        ["Backspace", "backspace"],
        ["Tab", "tab"],
        ["ArrowLeft", "left"],
        ["ArrowRight", "right"],
        ["ArrowDown", "down"],
        ["ArrowUp", "up"],
        ["Enter", "enter"],
        ["MetaLeft", "cmd"],
        ["MetaRight", "cmd"],
        ["ControlLeft", "ctrl"],
        ["ControlRight", "ctrl"],
        ["AltLeft", "alt"],
        ["AltRight", "alt"],
        ["ShiftLeft", "shift"],
        ["ShiftRight", "shift"],
        ["Home", "home"],
        ["End", "end"],
        ["PageUp", "pageup"],
        ["PageDown", "pagedown"],
        ["Space", "space"],
        // Numeric
        ["Digit1", "1"],
        [
            "Digit2",
            "2"
        ],
        [
            "Digit3",
            "3"
        ],
        [
            "Digit4",
            "4"
        ],
        [
            "Digit5",
            "5"
        ],
        [
            "Digit6",
            "6"
        ],
        [
            "Digit7",
            "7"
        ],
        [
            "Digit8",
            "8"
        ],
        [
            "Digit9",
            "9"
        ],
        [
            "Digit0",
            "0"
        ],
        // Symbols
        [
            "Backquote",
            "`"
        ],
        [
            "Minus",
            "-"
        ],
        [
            "Equal",
            "="
        ],
        // Letters
        [
            "KeyA",
            "a"
        ],
        [
            "KeyB",
            "b"
        ],
        [
            "KeyC",
            "c"
        ],
        [
            "KeyD",
            "d"
        ],
        [
            "KeyE",
            "e"
        ],
        [
            "KeyF",
            "f"
        ],
        [
            "KeyG",
            "g"
        ],
        [
            "KeyH",
            "h"
        ],
        [
            "KeyI",
            "i"
        ],
        [
            "KeyJ",
            "j"
        ],
        [
            "KeyK",
            "k"
        ],
        [
            "KeyL",
            "l"
        ],
        [
            "KeyM",
            "m"
        ],
        [
            "KeyN",
            "n"
        ],
        [
            "KeyO",
            "o"
        ],
        [
            "KeyP",
            "p"
        ],
        [
            "KeyQ",
            "q"
        ],
        [
            "KeyR",
            "r"
        ],
        [
            "KeyS",
            "s"
        ],
        [
            "KeyT",
            "t"
        ],
        [
            "KeyU",
            "u"
        ],
        [
            "KeyV",
            "v"
        ],
        [
            "KeyW",
            "w"
        ],
        [
            "KeyX",
            "x"
        ],
        [
            "KeyY",
            "y"
        ],
        ["KeyZ", "z"],
        ['Comma', ','],
        ['Semicolon', ';'],
        ['Period', '.'],
        ['Slash', '/'],
        ['Quote', `'`],
        ['BracketLeft', `[`],
        ['BracketRight', `]`],
        ['Delete', 'delete'],
    ]);
    // 0x001C	"Enter"	"Enter"
    // 0x001D	"ControlLeft"	"ControlLeft"
    // 0x0029	"Backquote"	"Backquote"
    // 0x0037	"NumpadMultiply"	"NumpadMultiply"
    // 0x0038	"AltLeft"	"AltLeft"
    // 0x003A	"CapsLock"	"CapsLock"

    function evtIsHotkey(evt, hotkeyStr) {
        return evtToStandardString(evt) === toStandardString(hotkeyStr);
    }
    function evtToStandardString(evt) {
        return hotkeyInfoToStandardString(evtToHotkeyInfo(evt));
    }
    function evtIsLikelyInput(evt) {
        return (!evt.metaKey && !evt.ctrlKey && !evt.altKey &&
            evt.key.length === 1);
    }
    // Order: cmd/ctrl/alt/shift
    function toStandardString(hotkeyStr) {
        const strs = hotkeyStr.split(' ');
        const endKey = strs[strs.length - 1];
        const hotkeyInfo = new HotkeyInfo(endKey);
        const set = new Set(strs);
        if (set.has('cmd')) {
            // Mac OS
            hotkeyInfo.metaKey = true;
        }
        if (set.has('ctrl')) {
            // Mac OS
            hotkeyInfo.ctrlKey = true;
        }
        if (set.has('shift')) {
            hotkeyInfo.shiftKey = true;
        }
        if (set.has('alt')) {
            hotkeyInfo.altKey = true;
        }
        return hotkeyInfoToStandardString(hotkeyInfo);
    }
    class HotkeyInfo {
        constructor(endKey = '', metaKey = false, ctrlKey = false, shiftKey = false, altKey = false) {
            this.endKey = endKey;
            this.metaKey = metaKey;
            this.ctrlKey = ctrlKey;
            this.shiftKey = shiftKey;
            this.altKey = altKey;
        }
    }
    function evtToHotkeyInfo(evt) {
        const info = new HotkeyInfo();
        const possHotkey = codeToHotkey.get(evt.code);
        if (!possHotkey) {
            throw new Error(`(Unknown evt code. Please add this to hotKeyUtil mapping: ${evt.code}`);
        }
        info.endKey = possHotkey;
        info.metaKey = evt.metaKey;
        info.ctrlKey = evt.ctrlKey;
        info.shiftKey = evt.shiftKey;
        info.altKey = evt.altKey;
        return info;
    }
    function hotkeyInfoToStandardString(info) {
        const strs = [];
        if (info.metaKey) {
            strs.push('cmd');
        }
        if (info.ctrlKey) {
            strs.push('ctrl');
        }
        if (info.shiftKey) {
            strs.push('shift');
        }
        if (info.altKey) {
            strs.push('alt');
        }
        strs.push(info.endKey);
        return strs.join(' ');
    }

    class Cell {
        constructor(text = '') {
            this.text = text;
        }
        isEmpty() {
            return this.text.trim() === '';
        }
    }

    const COLUMN_DELIMITER = ' | ';
    const ROW_DELIMITER = '\n';
    class TextTable {
        constructor(cells = [[new Cell()]], columnDelimiter = COLUMN_DELIMITER) {
            this.cells = cells;
            this.columnDelimiter = columnDelimiter;
        }
        static fromString(str, columnDelimiter = COLUMN_DELIMITER) {
            return new TextTable(stringToCells(str), columnDelimiter);
        }
        toString(trim = false) {
            return this.cells
                .map(row => row.map(cell => trim ? cell.text.trim() : cell.text)
                .join(this.columnDelimiter))
                .join(ROW_DELIMITER);
        }
        getCellsInArray() {
            return this.cells.flatMap(row => row);
        }
        applyLint() {
            // Remove consecutive spaces
            this.getCellsInArray().forEach(cell => stripConsecutiveSpaces(cell.text));
            // Make each column have the same number of spaces
            const rowDimensions = this.cells.map(row => row.length);
            const tranposedCells = getTransposedCells(this.cells);
            const paddedCells = getTransposedCells(tranposedCells.map(colOfCells => genColOfPaddedCells(colOfCells)));
            this.cells = getSubCells(paddedCells, rowDimensions);
        }
        getCellAndInsertIfAbsent(row, col) {
            if (!this.isWithinBound(row, col)) {
                this.insertEmptyCellIfAbsent(row, col);
            }
            return this.cells[row][col];
        }
        insertEmptyCellIfAbsent(row, col) {
            while (row >= this.cells.length) {
                this.cells.push([]);
            }
            while (col >= this.cells[row].length) {
                this.cells[row].push(new Cell());
            }
        }
        isWithinBound(row, col) {
            if (row < 0 || row >= this.cells.length) {
                return false;
            }
            if (col < 0 || col >= this.cells[row].length) {
                return false;
            }
            return true;
        }
    }
    ////// Functional functions (i.e. no mutation)
    function getSubCells(cells, rowDimensions) {
        return cells.map((row, i) => rowDimensions[i] > 0 ? row.slice(0, rowDimensions[i]) : []);
    }
    // Take into account that each row may have a different number of columns
    // by filling in empty cells with empty strings (which will change the overall dims)
    function getTransposedCells(cells) {
        const transposedCells = [];
        const numOfColsByRow = cells.map(row => row.length);
        const maxNumOfCols = Math.max(...numOfColsByRow);
        for (let i = 0; i < maxNumOfCols; i++) {
            transposedCells.push(getColumnsOfCells(cells, i));
        }
        return transposedCells;
    }
    function stripConsecutiveSpaces(str) {
        return str.replace(/\s+/g, ' ');
    }
    function stringToCells(str, columnDelimiter = COLUMN_DELIMITER) {
        return str.split(ROW_DELIMITER).map(row => row.split(columnDelimiter).map(text => new Cell(text)));
    }
    function getColumnsOfCells(cells, columnIdx) {
        return cells.map(row => columnIdx < row.length ? row[columnIdx] : new Cell(''));
    }
    function genColOfPaddedCells(colsOfCells) {
        const maxWidth = Math.max(...colsOfCells.map(c => c.text.length));
        return colsOfCells
            .map(c => c.text + ' '.repeat(maxWidth - c.text.length))
            .map(text => new Cell(text));
    }

    class TsCursor {
        constructor(rowIdx = 0, colIdx = 0, inTextMode = false, 
        // Relevant only in text mode
        textIdx = 0, inTextSelectionMode = false, 
        // Relevant only in text selection mode
        textEndIdx = 0) {
            this.rowIdx = rowIdx;
            this.colIdx = colIdx;
            this.inTextMode = inTextMode;
            this.textIdx = textIdx;
            this.inTextSelectionMode = inTextSelectionMode;
            this.textEndIdx = textEndIdx;
        }
        // Note that the cursor is not aware of being out-of-bound.
        // It's the responsibility of the editor to ensure that.
        moveToRightCell() {
            this.colIdx++;
            this.inTextMode = false;
        }
        moveToLeftCell() {
            this.colIdx--;
            if (this.colIdx < 0) {
                this.colIdx = 0;
            }
            this.inTextMode = false;
        }
        moveToBelowCell() {
            this.rowIdx++;
            this.inTextMode = false;
        }
        moveToAboveCell() {
            this.rowIdx--;
            if (this.rowIdx < 0) {
                this.rowIdx = 0;
            }
            this.inTextMode = false;
        }
    }

    function shouldRerenderAndPreventDefault() {
        return {
            rerender: true,
            applyBrowserDefault: false,
        };
    }
    function shouldApplyBrowserDefaultWithoutRerendering() {
        return {
            rerender: false,
            applyBrowserDefault: true,
        };
    }
    function shouldPreventDefaultWithoutRerendering() {
        return {
            rerender: false,
            applyBrowserDefault: false,
        };
    }
    class TsEditor {
        constructor(
        // I/O
        textarea, 
        // Model; public to allow for the lowest-level operations
        textTable = new TextTable(), cursor = new TsCursor(), keydownHandler = undefined, onRenderHandler = undefined) {
            this.textarea = textarea;
            this.textTable = textTable;
            this.cursor = cursor;
            this.keydownHandler = keydownHandler;
            this.onRenderHandler = onRenderHandler;
            this.textarea.onkeydown = evt => this.handleTextareaKeydown(evt);
            this.textarea.onclick = evt => {
                // TODO use the selection range to determine which cell the cursor should be on
            };
        }
        onRender(onRenderHandler) {
            this.onRenderHandler = onRenderHandler;
        }
        render() {
            // console.log('lint + update cursor')
            this.textTable.applyLint();
            this.textarea.value = this.textTable.toString();
            this.updateTextareaSelectionFromCursors();
            if (this.onRenderHandler) {
                this.onRenderHandler();
            }
        }
        updateTextareaSelectionFromCursors() {
            this.textarea.selectionStart = this.inferSelectionStart();
            this.textarea.selectionEnd = this.inferSelectionEnd();
        }
        //// Event processing  ////
        // Allow client to specify custom keydown handler.
        onKeydown(handler) {
            this.keydownHandler = handler;
        }
        handleTextareaKeydown(evt) {
            const handleKeyDown = (evt) => {
                if (this.keydownHandler) {
                    return this.keydownHandler(evt);
                }
                return this.defaultKeydownHandler(evt);
            };
            const handlerOutput = handleKeyDown(evt);
            if (!handlerOutput.applyBrowserDefault) {
                evt.preventDefault();
            }
            if (handlerOutput.rerender) {
                this.render();
            }
        }
        handleTextInput(str) {
            const currCell = this.getCurrCell();
            if (!this.cursor.inTextMode) {
                currCell.text = str;
                this.cursor.inTextMode = true;
                this.cursor.textIdx = str.length;
                return;
            }
            if (!this.cursor.inTextSelectionMode) {
                // TODO splice based on textIdx
                const oldText = currCell.text;
                currCell.text = oldText.slice(0, this.cursor.textIdx) + str + oldText.slice(this.cursor.textIdx);
                this.cursor.textIdx += str.length;
                return;
            }
            // TODO: handle textSelectionMode
        }
        defaultKeydownHandler(evt) {
            if (evtIsLikelyInput(evt)) {
                this.handleTextInput(evt.key);
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'tab')) {
                this.moveToRightCell();
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'shift tab')) {
                this.moveLeftOrUpAndRight();
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'enter')) {
                if (!this.cursor.inTextMode) {
                    this.enterTextMode();
                    return shouldRerenderAndPreventDefault();
                }
                this.moveDownToLeftmostColumn();
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'left')) {
                this.moveLeft();
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'right')) {
                this.moveRight();
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'up')) {
                this.moveUp();
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'down')) {
                this.moveDown();
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'backspace')) {
                const hasChanged = this.removeTextOrMoveBack();
                if (!hasChanged) {
                    this.moveLeftOrUpAndRight();
                }
                return shouldRerenderAndPreventDefault();
            }
            if (evtIsHotkey(evt, 'cmd backspace')) {
                const hasChanged = this.removeTextOrMoveBack(true);
                if (!hasChanged) {
                    this.moveLeftOrUpAndRight();
                }
                return shouldRerenderAndPreventDefault();
            }
            return shouldApplyBrowserDefaultWithoutRerendering();
        }
        //removeEntireWord: removes until a space is encountered.
        // Returns whether or not there is anything removed.
        removeTextOrMoveBack(removeEntireWord = false) {
            const currCell = this.getCurrCell();
            if (this.cursor.inTextMode) {
                if (this.cursor.textIdx === 0) {
                    return false;
                }
                if (!removeEntireWord) {
                    currCell.text = currCell.text.slice(0, this.cursor.textIdx - 1) + currCell.text.slice(this.cursor.textIdx);
                    this.cursor.textIdx -= 1;
                    return true;
                }
                const tokens = currCell.text.slice(0, this.cursor.textIdx).trimEnd().split(/(\s+)/);
                const resultingSubstr = tokens.slice(0, tokens.length - 1).join('');
                currCell.text = resultingSubstr + currCell.text.slice(this.cursor.textIdx);
                this.cursor.textIdx = resultingSubstr.length;
                return true;
            }
            if (!currCell.isEmpty()) {
                currCell.text = '';
                return true;
            }
            return false;
        }
        moveLeftOrUpAndRight(removeCurrCellIfNoCellToRight = false) {
            // TODO remove the current cell there is if no more cell to the right.
            // TODO If at left boundary, move up to right most cell
            this.moveToLeftCell();
        }
        getCurrCell() {
            return this.textTable.getCellAndInsertIfAbsent(this.cursor.rowIdx, this.cursor.colIdx);
        }
        moveRight() {
            if (this.cursor.inTextMode && this.cursor.textIdx < this.getCurrCell().text.trimEnd().length) {
                this.cursor.textIdx += 1;
                return;
            }
            this.moveToRightCell();
        }
        moveToRightCell() {
            this.cursor.moveToRightCell();
            this.textTable.insertEmptyCellIfAbsent(this.cursor.rowIdx, this.cursor.colIdx);
        }
        moveLeft() {
            if (this.cursor.inTextMode && this.cursor.textIdx > 0) {
                this.cursor.textIdx -= 1;
                return;
            }
            this.moveToLeftCell();
        }
        moveToLeftCell() {
            this.cursor.moveToLeftCell();
            this.textTable.insertEmptyCellIfAbsent(this.cursor.rowIdx, this.cursor.colIdx);
        }
        moveUp() {
            this.cursor.moveToAboveCell();
            this.textTable.insertEmptyCellIfAbsent(this.cursor.rowIdx, this.cursor.colIdx);
        }
        moveDown() {
            this.cursor.moveToBelowCell();
            this.textTable.insertEmptyCellIfAbsent(this.cursor.rowIdx, this.cursor.colIdx);
        }
        moveDownToLeftmostColumn() {
            this.cursor.moveToBelowCell();
            this.cursor.colIdx = 0;
            this.textTable.insertEmptyCellIfAbsent(this.cursor.rowIdx, this.cursor.colIdx);
        }
        enterTextMode() {
            this.cursor.inTextMode = true;
            const currCell = this.textTable.getCellAndInsertIfAbsent(this.cursor.rowIdx, this.cursor.colIdx);
            this.cursor.textIdx = currCell.text.trimEnd().length;
        }
        // Helpers
        inferSelectionStart() {
            let idx = 0;
            const text = this.textarea.value;
            text.split(ROW_DELIMITER).forEach((line, i) => {
                if (i > this.cursor.rowIdx) {
                    return;
                }
                if (i === this.cursor.rowIdx) {
                    line.split(COLUMN_DELIMITER).forEach((cellText, j) => {
                        if (j > this.cursor.colIdx) {
                            return;
                        }
                        if (j === this.cursor.colIdx) {
                            if (this.cursor.inTextMode) {
                                idx += this.cursor.textIdx;
                            }
                            return;
                        }
                        idx += cellText.length + COLUMN_DELIMITER.length;
                    });
                    return;
                }
                idx += line.length + ROW_DELIMITER.length;
            });
            return idx;
        }
        inferSelectionEnd() {
            let idx = this.inferSelectionStart();
            if (this.cursor.inTextMode) {
                if (this.cursor.inTextSelectionMode) {
                    return idx + this.cursor.textEndIdx;
                }
                return idx;
            }
            const currCell = this.textTable.cells[this.cursor.rowIdx][this.cursor.colIdx];
            // add one so that for zero length text, user can still see the cell selected.
            const textLength = currCell.text.trimEnd().length;
            if (textLength === 0) {
                return idx + 1;
            }
            return idx + textLength;
        }
    }

    class TsUi extends HTMLElement {
        constructor(tsEditor) {
            super();
            this.tsEditor = tsEditor;
        }
        connectedCallback() {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            const textarea = document.createElement('textarea');
            textarea.id = 'editing-textarea';
            textarea.style.width = '100%';
            textarea.style.fontSize = '24px';
            textarea.rows = 10;
            textarea.spellcheck = false;
            textarea.autofocus = true;
            shadowRoot.appendChild(textarea);
            this.tsEditor = new TsEditor(textarea);
        }
    }
    customElements.define('textarea-spreadsheet-ui', TsUi);

    // Pure functions
    function addKeyValToUrl(startingUrl, key, val) {
        const url = toInternalUrl(startingUrl);
        if (val !== undefined) {
            url.searchParams.set(key, val);
        }
        else {
            url.searchParams.delete(key);
        }
        return toExternalUrlStr(url);
    }
    function toInternalUrl(externalUrlStr) {
        return new URL(externalUrlStr.replace('#', '?'));
    }
    function toExternalUrlStr(internalUrl) {
        internalUrl.searchParams.sort();
        return internalUrl.href.replace('?', '#');
    }
    function getUrlParamsMapFromString(urlStr) {
        const keyVals = new Map();
        if (!urlStr) {
            return keyVals;
        }
        const url = toInternalUrl(urlStr);
        url.searchParams.forEach(function (value, key) {
            keyVals.set(key, value);
        });
        return keyVals;
    }
    // Impure functions based on the document url and can mutate the document.
    function setUrlParam(key, val) {
        const externalUrlStr = addKeyValToUrl(document.URL, key, val);
        window.location.hash = externalUrlStr.includes('#') ? externalUrlStr.split('#')[1] : '';
    }

    // The text index will be on the right of any spaces
    function getTextIdxOnTheLeft(text, currTextIdx) {
        const tokenInfos = getTokenInfos(text);
        const idx = getTokenInfosContainingCurrTextIdx(tokenInfos, currTextIdx);
        if (idx <= 0) {
            return 0;
        }
        return tokenInfos[idx].startIdx;
    }
    // The text index will be on the right of any spaces
    function getTextIdxOnTheRight(text, currTextIdx) {
        const tokenInfos = getTokenInfos(text);
        const idx = getTokenInfosContainingCurrTextIdx(tokenInfos, currTextIdx);
        if (tokenInfos.length === 0) {
            return 0;
        }
        return tokenInfos[idx + 1].endIdx;
    }
    function getTokenInfos(text) {
        let idx = 0;
        // Split so that 'A B C ' becomes ['A ', 'B ', 'C ']
        return text.split(/(?!\s+)/).map(token => {
            const oldIdx = idx;
            idx += token.length;
            return {
                string: token,
                startIdx: oldIdx,
                endIdx: idx,
            };
        });
    }
    // (---](--](--x--] --> tokenInfosIdxContainingCurrTextIdx is 2
    function getTokenInfosContainingCurrTextIdx(tokenInfos, currTextIdx) {
        for (let tokenInfoIdx = 0; tokenInfoIdx < tokenInfos.length; tokenInfoIdx++) {
            const tokenStartingIdx = tokenInfos[tokenInfoIdx].startIdx;
            if (currTextIdx <= tokenStartingIdx) {
                return tokenInfoIdx - 1;
            }
        }
        return tokenInfos.length - 1;
    }

    function genMidiChordSheetLink(textTable) {
        const json = textTableToArrOfArrs(textTable);
        const jsonStr = JSON.stringify(json);
        return jsonStringToLink(jsonStr);
    }
    function textTableToArrOfArrs(textTable) {
        const res = [
            ['', 'Key: C'],
            ['', 'Meter: 4/4'],
            ['', 'Tempo: 180'],
            ['', 'Part: A'],
            ['', '_'],
            ['', 'Voice: A'],
        ];
        const arrOfArrs = textTable.cells.map(row => row.map(cell => {
            const text = cell.text.trim();
            return text.replace(/;/g, '|');
        }));
        return res.concat(arrOfArrs);
    }
    function jsonStringToLink(jsonStr) {
        const baseLink = 'https://slowbubble.github.io/MidiChordSheet/';
        const title = 'untitled';
        return `${baseLink}#displayNotes=1&title=${title}&data=${encodeURIComponent(jsonStr)}`;
    }

    const keyToNoteNum = new Map([
        ["'", 41],
        ['/', 42],
        [';', 43],
        ['.', 44],
        ['l', 45],
        [',', 46],
        ['k', 47],
        ['j', 48],
        ['n', 49],
        ['h', 50],
        ['b', 51],
        ['g', 52],
        ['f', 53],
        ['c', 54],
        ['d', 55],
        ['s', 57],
        ['z', 58],
        ['a', 59],
        ['1', 60],
        ['q', 61],
        ['2', 62],
        ['w', 63],
        ['3', 64],
        ['4', 65],
        ['r', 66],
        ['5', 67],
        ['t', 68],
        ['6', 69],
        ['y', 70],
        ['7', 71],
        ['8', 72],
        ['i', 73],
        ['9', 74],
        ['o', 75],
        ['0', 76],
        ['-', 77],
        ['[', 78],
        ['=', 79],
        [']', 80],
    ]);
    function mapKeyToNoteNum(key) {
        return keyToNoteNum.get(key);
    }

    const modNoteNumToAbc = new Map([
        [0, 'C'],
        [1, 'C#'],
        [2, 'D'],
        [3, 'Eb'],
        [4, 'E'],
        [5, 'F'],
        [6, 'F#'],
        [7, 'G'],
        [8, 'G#'],
        [9, 'A'],
        [10, 'Bb'],
        [11, 'B'],
    ]);
    function noteNumToAbc(noteNum) {
        const possibleStr = modNoteNumToAbc.get(mod(noteNum, 12));
        if (!possibleStr) {
            throw new Error('Invalid noteNum: ' + noteNum);
        }
        const numOctaveAboveMiddleC = Math.floor((noteNum - 60) / 12);
        if (numOctaveAboveMiddleC < 0) {
            return '/'.repeat(-numOctaveAboveMiddleC) + possibleStr;
        }
        return '\\'.repeat(numOctaveAboveMiddleC) + possibleStr;
    }
    function mod(a, b) {
        return (a % b + b) % b;
    }

    class MsEditor {
        constructor(tsEditor, magicMode = true, numFullBarsPerRow = 4, customHotkeyToAction = new Map()) {
            this.tsEditor = tsEditor;
            this.magicMode = magicMode;
            this.numFullBarsPerRow = numFullBarsPerRow;
            this.customHotkeyToAction = customHotkeyToAction;
            this.buffer = [];
            this.tsEditor.onKeydown(evt => {
                if (this.magicMode) {
                    return this.handleKeyDown(evt);
                }
                return this.tsEditor.defaultKeydownHandler(evt);
            });
        }
        getMidiChordSheetLink() {
            return genMidiChordSheetLink(this.tsEditor.textTable);
        }
        getMelodocLink() {
            const baseLink = 'https://slowbubble.github.io/melodoc/';
            const textContent = this.tsEditor.textTable.toString(true);
            return addKeyValToUrl(baseLink, 'data', textContent);
        }
        handleKeyDown(evt) {
            // google add-on shortcuts;
            const action = this.customHotkeyToAction.get(evtToStandardString(evt));
            if (action) {
                action();
                return shouldPreventDefaultWithoutRerendering();
            }
            // Need to disable custom behavior to avoid infinite loop.
            this.buffer.push(evt);
            window.setTimeout(() => {
                // Special keys should come before other keys
                this.buffer.sort((evt1, evt2) => {
                    const isSpecialKey = evtIsHotkey(evt1, 'tab') || evtIsHotkey(evt1, '`');
                    const isSpecialKey2 = evtIsHotkey(evt2, 'tab') || evtIsHotkey(evt2, '`');
                    if (!isSpecialKey && isSpecialKey2) {
                        return 1;
                    }
                    return -1;
                });
                let rerender = false;
                this.buffer.forEach(evt => {
                    const shouldRerender = this.handleKeyDownAfterOrdering(evt);
                    rerender || (rerender = shouldRerender);
                });
                this.buffer = [];
                if (rerender) {
                    this.tsEditor.render();
                }
            }, 100);
            // Browser default needs to be explicitly enabled.
            if (evtIsHotkey(evt, 'cmd r'))
                return shouldApplyBrowserDefaultWithoutRerendering();
            if (evtIsHotkey(evt, 'cmd c'))
                return shouldApplyBrowserDefaultWithoutRerendering();
            if (evtIsHotkey(evt, 'cmd x'))
                return shouldApplyBrowserDefaultWithoutRerendering();
            // No-op because we will handle it in handleKeyDownAfterOrdering.
            return shouldPreventDefaultWithoutRerendering();
        }
        // Returns whether or not to re-render.
        handleKeyDownAfterOrdering(evt) {
            if (evtIsHotkey(evt, '`')) {
                const numDividersInCell = (this.tsEditor.getCurrCell().text.match(/;/g) || []).length;
                // TODO Use meterDenom - 1 instead of 3.
                const hasEnoughDividers = numDividersInCell === 3;
                if (hasEnoughDividers) {
                    this.handleTab();
                    return true;
                }
                this.addDivider();
                return true;
            }
            if (evtIsHotkey(evt, 'space')) {
                this.addProtraction();
                return true;
            }
            if (evtIsLikelyInput(evt)) {
                const possNoteNum = mapKeyToNoteNum(evt.key);
                if (possNoteNum) {
                    const abc = noteNumToAbc(possNoteNum);
                    this.handleTextInputWithPadding(abc);
                    return true;
                }
            }
            if (evtIsHotkey(evt, 'tab')) {
                this.handleTab();
                return true;
            }
            if (evtIsHotkey(evt, 'backspace')) {
                const hasChanged = this.tsEditor.removeTextOrMoveBack(true);
                if (!hasChanged) {
                    this.moveLeftOrUpRightWhereTextExists(true);
                }
                return true;
            }
            if (evtIsHotkey(evt, 'left')) {
                this.handleLeft();
                return true;
            }
            if (evtIsHotkey(evt, 'right')) {
                this.handleRight();
                return true;
            }
            return false;
        }
        // Move left if there is text in any cells in the left.
        // Otherwise, move up one row to the right-most cell with content
        moveLeftOrUpRightWhereTextExists(removeCurrCellIfNonEssential = false) {
            const oldRowIdx = this.tsEditor.cursor.rowIdx;
            const oldColIdx = this.tsEditor.cursor.colIdx;
            const currRow = this.tsEditor.textTable.cells[oldRowIdx];
            const textExistsInTheLeft = currRow.slice(0, oldColIdx).some(cell => !cell.isEmpty());
            if (oldColIdx > 1 || textExistsInTheLeft) {
                this.tsEditor.moveToLeftCell();
                if (removeCurrCellIfNonEssential) {
                    // Remove the cells to the right of the cursor.
                    const hasThingsToTheRight = currRow.slice(oldColIdx).some(cell => !cell.isEmpty());
                    if (!hasThingsToTheRight) {
                        this.tsEditor.textTable.cells[oldRowIdx] = currRow.slice(0, oldColIdx);
                    }
                }
                return;
            }
            if (this.tsEditor.cursor.rowIdx === 0) {
                return;
            }
            this.tsEditor.cursor.rowIdx -= 1;
            if (removeCurrCellIfNonEssential) {
                // Remove the entire row if nothing is below it.
                const rowsBelow = this.tsEditor.textTable.cells.slice(oldRowIdx);
                const hasStuffBelow = rowsBelow.some(row => row.some(cell => !cell.isEmpty()));
                console.log(rowsBelow);
                console.log(hasStuffBelow);
                if (!hasStuffBelow) {
                    this.tsEditor.textTable.cells = this.tsEditor.textTable.cells.slice(0, oldRowIdx);
                }
            }
            this.tsEditor.cursor.colIdx = this.numFullBarsPerRow;
            // const newRow = this.tsEditor.textTable.cells[this.tsEditor.cursor.rowIdx];
            // for (let idx = newRow.length - 1; idx >= 0; idx--) {
            //   if (!newRow[idx].isEmpty()) {
            //     this.tsEditor.cursor.colIdx = idx;
            //     return;
            //   }
            // }
            // this.tsEditor.cursor.colIdx = 0;
        }
        handleLeft() {
            if (this.tsEditor.cursor.inTextMode && this.tsEditor.cursor.textIdx > 0) {
                this.tsEditor.cursor.textIdx = getTextIdxOnTheLeft(this.tsEditor.getCurrCell().text, this.tsEditor.cursor.textIdx);
                return;
            }
            this.tsEditor.moveToLeftCell();
        }
        handleRight() {
            const text = this.tsEditor.getCurrCell().text;
            if (this.tsEditor.cursor.inTextMode && this.tsEditor.cursor.textIdx < text.length) {
                this.tsEditor.cursor.textIdx = getTextIdxOnTheRight(text, this.tsEditor.cursor.textIdx);
                return;
            }
            if (this.tsEditor.cursor.colIdx === this.numFullBarsPerRow) {
                return;
            }
            this.tsEditor.moveToRightCell();
        }
        handleTab() {
            if (this.tsEditor.cursor.colIdx < this.numFullBarsPerRow) {
                this.tsEditor.moveToRightCell();
                return;
            }
            this.tsEditor.moveDownToLeftmostColumn();
            // Move right before the left-most cell is the pick-up bar.
            this.tsEditor.moveToRightCell();
        }
        addDivider() {
            this.handleTextInputWithPadding(';');
        }
        addProtraction() {
            this.handleTextInputWithPadding('_');
        }
        handleTextInputWithPadding(text) {
            const cursor = this.tsEditor.cursor;
            let paddedText = ` ${text} `;
            if (!cursor.inTextMode || cursor.textIdx === 0) {
                paddedText = `${text} `;
            }
            else if (this.tsEditor.getCurrCell().text.slice(cursor.textIdx - 1, cursor.textIdx) === ' ') {
                paddedText = `${text} `;
            }
            this.tsEditor.handleTextInput(paddedText);
        }
    }

    class MsUi extends HTMLElement {
        constructor(msEditor, renderHandler = null) {
            super();
            this.msEditor = msEditor;
            this.renderHandler = renderHandler;
        }
        connectedCallback() {
            const shadowRoot = this.attachShadow({ mode: 'open' });
            const tsUi = document.createElement('textarea-spreadsheet-ui');
            shadowRoot.appendChild(tsUi);
            const div = document.createElement('div');
            div.innerHTML = html;
            shadowRoot.appendChild(div);
            const iframe = shadowRoot.getElementById('sheet-music-iframe');
            this.msEditor = new MsEditor(tsUi.tsEditor);
            tsUi.tsEditor.onRender(() => {
                iframe.src = this.msEditor.getMidiChordSheetLink();
                if (this.renderHandler) {
                    this.renderHandler();
                }
            });
        }
        onRender(renderHandler) {
            this.renderHandler = renderHandler;
        }
    }
    const html = `
<iframe id="sheet-music-iframe"
    title="Sheet Music"
    width="100%"
    height="450">
</iframe>
`;
    customElements.define('music-spreadsheet-ui', MsUi);

    function setupGoogleAddOnActions(msEditor) {
        // TODO add a shortcut for resizing modal.
        document.getElementById('add-image-button')?.addEventListener('keydown', () => addImageWithLinkToDoc(msEditor.getMelodocLink()));
        msEditor.customHotkeyToAction.set('shift i', () => addImageWithLinkToDoc(msEditor.getMelodocLink()));
    }
    function onSuccess() {
        google.script.host.close();
    }
    function onFailure(error) {
        alert(error.message);
    }
    function addImageWithLinkToDoc(link) {
        const dialog = document.getElementById('inserting-dialog');
        dialog.showModal();
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            dialog.close();
            return;
        }
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 100);
        ctx.lineTo(200, 100);
        ctx.lineTo(200, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        canvas.toBlob(async (blob) => {
            if (!blob) {
                dialog.close();
                return;
            }
            const blobInArray = Array.from(new Uint8Array(await blob.arrayBuffer()));
            google.script.run
                .withSuccessHandler(onSuccess)
                .withFailureHandler(onFailure)
                .addImageWithLink(blobInArray, link);
        });
    }

    function isInGoogleAddOn() {
        return typeof google !== 'undefined';
    }

    function main(url) {
        const mainDiv = document.getElementById('main');
        mainDiv.innerHTML = '';
        const msUiElt = document.createElement('music-spreadsheet-ui');
        mainDiv.appendChild(msUiElt);
        const urlParams = getUrlParamsMapFromString(url);
        const data = urlParams.has('data') ? urlParams.get('data') : '';
        console.log(data);
        msUiElt.msEditor.tsEditor.textTable = TextTable.fromString(data);
        msUiElt.msEditor.tsEditor.render();
        if (isInGoogleAddOn()) {
            setupGoogleAddOnActions(msUiElt.msEditor);
        }
        else {
            msUiElt.onRender(() => {
                const textContent = msUiElt.msEditor.tsEditor.textTable.toString(true);
                setUrlParam('data', textContent);
            });
        }
    }

    main(linkPointedToByCursor);

})();
//# sourceMappingURL=googleAddOnMain.js.map
