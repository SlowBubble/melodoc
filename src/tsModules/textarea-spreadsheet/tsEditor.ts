import { codeToHotkey } from "../hotkey-util/hotkeyAndCode";
import { evtIsHotkey, evtIsLikelyInput } from "../hotkey-util/hotkeyUtil";
import { UndoMgr } from "../undo/undoMgr";
import { Cell } from "./cell";
import { COLUMN_DELIMITER, ROW_DELIMITER, TextTable } from "./textTable";
import { TsCursor } from "./tsCursor";

export interface KeydownHandlerOutput {
  rerender: boolean;
  applyBrowserDefault: boolean;
}

export function shouldRerenderAndPreventDefault() {
  return {
    rerender: true,
    applyBrowserDefault: false,
  };
}

export function shouldApplyBrowserDefaultWithoutRerendering() {
  return {
    rerender: false,
    applyBrowserDefault: true,
  };
}

export function shouldPreventDefaultWithoutRerendering() {
  return {
    rerender: false,
    applyBrowserDefault: false,
  };
}

export type KeydownHandler = (evt: KeyboardEvent) => KeydownHandlerOutput;

class State {
  constructor(
    public tableStr: string = (new TextTable().toString()),
    public cursorStr: string = (new TsCursor().serialize()),
  ) {}
  static equal(a: State, b: State) {
    return a.tableStr === b.tableStr;
  }
};

export class TsEditor {
  private undoMgr: UndoMgr<State> = new UndoMgr(new State(), State.equal);

  constructor(
      // I/O
      public textarea: HTMLTextAreaElement,
      // Model; public to allow for the lowest-level operations
      public textTable = new TextTable(),
      public cursor = new TsCursor(),
      public keydownHandler: KeydownHandler | undefined = undefined,
      public onRenderHandler: Function | undefined = undefined,
  ) {
    this.textarea.onkeydown = evt => this.handleTextareaKeydown(evt)
    this.textarea.onclick = evt => {
      // TODO use the selection range to determine which cell the cursor should be on
      console.log('onclick', evt);
    }
    // For text input like shift+enter or alt+i, keydownEvt.preventDefault() does not work
    // so I have to intercept them here and revert the changes by running render().
    this.textarea.oninput = evt => {
      console.log('Reverting this input evt', evt);
      this.render();
    };
    this.textarea.onpaste = evt => this.paste(evt);
  }

  onRender(onRenderHandler: Function) {
    this.onRenderHandler = onRenderHandler;
  }

  render() {
    const shouldTrimEnds = !this.cursor.inTextMode;
    this.textTable.applyLint(shouldTrimEnds);
    this.textarea.value = this.textTable.toString();
    this.updateTextareaSelectionFromCursors();

    // Must be done after all states have been updates.
    this.undoMgr.recordCurrState(this.getCurrState());

    if (this.onRenderHandler) {
      this.onRenderHandler();
    }
    console.log('rendered========')
  }

  undo() {
    const state = this.undoMgr.undo();
    if (state) {
      this.loadState(state);
    }
  }
  redo() {
    const state = this.undoMgr.redo();
    if (state) {
      this.loadState(state);
    }
  }
  private getCurrState() {
    return new State(this.textTable.toString(), this.cursor.serialize());
  }
  private loadState(state: State) {
    this.textTable = TextTable.fromString(state.tableStr);
    this.cursor = TsCursor.deserialize(state.cursorStr);
  }

  private updateTextareaSelectionFromCursors() {
    this.textarea.selectionStart = this.inferSelectionStart();
    this.textarea.selectionEnd = this.inferSelectionEnd();
  }

  //// Event processing  ////
  // Allow client to specify custom keydown handler.
  onKeydown(handler: KeydownHandler) {
    this.keydownHandler = handler;
  }

  private handleTextareaKeydown(evt: KeyboardEvent) {
    const endKey = codeToHotkey.get(evt.code);
    if (endKey && endKeysToIgnore.has(endKey)) {
      return;
    }

    const handleKeyDown = (evt: KeyboardEvent) => {
      if (this.keydownHandler) {
        return this.keydownHandler(evt);
      }
      return this.defaultKeydownHandler(evt);
    }
    const handlerOutput = handleKeyDown(evt);
    if (!handlerOutput.applyBrowserDefault) {
      evt.preventDefault();
    }
    if (handlerOutput.rerender) {
      this.render();
    }
  }

  handleTextInput(str: string) {
    const currCell = this.getCurrCell();
    if (!this.cursor.inTextMode) {
      currCell.text = str;
      this.cursor.inTextMode = true;
      this.cursor.textIdx = str.length;
      return shouldRerenderAndPreventDefault();
    }
    if (!this.cursor.inTextSelectionMode) {
      // TODO splice based on textIdx
      const oldText = currCell.text;
      currCell.text = oldText.slice(0, this.cursor.textIdx) + str + oldText.slice(this.cursor.textIdx);
      this.cursor.textIdx += str.length;
      return shouldRerenderAndPreventDefault();
    }
    // TODO: handle textSelectionMode
    return shouldRerenderAndPreventDefault();
  }

  defaultKeydownHandler(evt: KeyboardEvent): KeydownHandlerOutput {
    if (evtIsLikelyInput(evt)) {
      return this.handleTextInput(evt.key);
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
      };
      return shouldRerenderAndPreventDefault();
    }
    if (evtIsHotkey(evt, 'cmd backspace')) {
      const hasChanged = this.removeTextOrMoveBack(true);
      if (!hasChanged) {
        this.moveLeftOrUpAndRight();
      };
      return shouldRerenderAndPreventDefault();
    }
    if (evtIsHotkey(evt, 'cmd z')) {
      this.undo();
      return shouldRerenderAndPreventDefault();
    }
    if (evtIsHotkey(evt, 'cmd shift z')) {
      this.redo();
      return shouldRerenderAndPreventDefault();
    }

    return shouldApplyBrowserDefaultWithoutRerendering();
  }

  // Must be triggered from cmd+v due to browser security.
  paste(evt: ClipboardEvent) {
    evt.preventDefault();
    if (!evt.clipboardData) {
      return;
    }
    const data = evt.clipboardData.getData("text");
    if (this.textarea.value.trim().length !== 0) {
      // TODO handle this
      return;
    }
    this.textTable = TextTable.fromString(data);
    this.cursor = new TsCursor();
    this.render();
  }
  handleClearAll() {
    this.textTable = new TextTable();
    this.cursor = new TsCursor();
    return shouldRerenderAndPreventDefault();
  }

  handleAddRowAbove() {
    this.textTable.cells.splice(this.cursor.rowIdx, 0, [new Cell()]);
    this.cursor.colIdx = 0;
    return shouldRerenderAndPreventDefault();
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
  moveLeftOrUpAndRight(removeCurrCellIfNoCellToRight=false) {
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
      };
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
    if (!this.textTable.isWithinBound(this.cursor.rowIdx, this.cursor.colIdx)) {
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

const endKeysToIgnore = new Set(['shift', 'alt', 'cmd', 'ctrl', 'meta']);

