import { addKeyValToUrl } from "../../url";
import { evtIsHotkey, evtIsLikelyInput, evtToStandardString } from "../hotkey-util/hotkeyUtil";
import { Cell } from "../textarea-spreadsheet/cell";
import { getTextIdxOnTheLeft, getTextIdxOnTheRight } from "../textarea-spreadsheet/textUtil";
import { KeydownHandlerOutput, TsEditor, shouldApplyBrowserDefaultWithoutRerendering, shouldPreventDefaultWithoutRerendering, shouldRerenderAndPreventDefault } from "../textarea-spreadsheet/tsEditor";
import { genMidiChordSheetLink } from "./genLink";
import { mapKeyToNoteNum } from "./keyToNoteNumMapping";
import { noteNumToAbc } from "./noteNumToAbcMapping";
import { rowHasVoice } from "./parsingUtil";

export class MsEditor {
  private buffer: KeyboardEvent[] = [];
  private hotkeyToAction = new Map<string, (evt: KeyboardEvent) => KeydownHandlerOutput>();
  // The boolean is to signal whether or not to re-render
  private hotkeyToMagicAction = new Map<string, (evt: KeyboardEvent) => KeydownHandlerOutput>();
  public customHotkeyToAction = new Map<string, (evt: KeyboardEvent) => KeydownHandlerOutput | void>();
  public useMagicModeWhenInVoiceCell = true;
  public numFullBarsPerRow = 4;
  public magicDelayMs = 100;

  constructor(public tsEditor: TsEditor) {
    this.tsEditor.onKeydown(evt => this.handleKeyDown(evt));

    this.hotkeyToMagicAction.set('space', _ => this.handleAddProtraction());
    this.hotkeyToMagicAction.set('`', _ => this.handleBacktick());
    this.hotkeyToMagicAction.set('tab', _ => this.handleTab());

    this.hotkeyToAction.set('cmd a', _ => this.tsEditor.handleClearAll());
    this.hotkeyToAction.set('up', evt => this.tsEditor.defaultKeydownHandler(evt));
    this.hotkeyToAction.set('down', evt => this.tsEditor.defaultKeydownHandler(evt));
    // TODO impl custom logic
    this.hotkeyToAction.set('shift tab', evt => this.tsEditor.defaultKeydownHandler(evt));
    this.hotkeyToAction.set('cmd shift z', evt => this.tsEditor.defaultKeydownHandler(evt));
    this.hotkeyToAction.set('left', _ => this.handleLeft());
    this.hotkeyToAction.set('right', _ => this.handleRight());
    this.hotkeyToAction.set('backspace', _ => this.handleBackspace());
    this.hotkeyToAction.set('enter', _ => this.handleEnter());
    this.hotkeyToAction.set('alt p', _ => this.handleAddChordRowAbove());
    this.hotkeyToAction.set('tab', _ => this.handleTab());
  }

  isInVoiceCell() {
    const row = this.tsEditor.textTable.cells[this.tsEditor.cursor.rowIdx];
    if (!row) {
      return true;
    }
    return rowHasVoice(row);
  }

  handleAddChordRowAbove() {
    this.tsEditor.textTable.cells.splice(
      this.tsEditor.cursor.rowIdx, 0, [new Cell('Chord:'), new Cell()]);
    this.tsEditor.cursor.colIdx = 1;
    return shouldRerenderAndPreventDefault();
  }

  getMidiChordSheetLink() {
    return genMidiChordSheetLink(this.tsEditor.textTable);
  }

  getMelodocLink() {
    let baseLink = 'https://slowbubble.github.io/melodoc/';
    // Uncomment the line below if you need to test the web app locally from the add-on generated link.
    // baseLink = 'http://localhost:8000/';
    const textContent = this.tsEditor.textTable.toString(true);
    return addKeyValToUrl(baseLink, 'data', textContent);
  }

  handleKeyDown(evt: KeyboardEvent): KeydownHandlerOutput {
    const evtStandardStr = evtToStandardString(evt);

    // 0. Custom hotkeys.
    const customAction = this.customHotkeyToAction.get(evtStandardStr);
    if (customAction) {
      const output = customAction(evt);
      return output || shouldPreventDefaultWithoutRerendering();
    }

    // 1. Browser default hotkeys.
    if (evtIsHotkey(evt, 'cmd r')) {
      return shouldApplyBrowserDefaultWithoutRerendering();
    }

    const inMagicMode = this.isInVoiceCell() && this.useMagicModeWhenInVoiceCell && (
      this.hotkeyToMagicAction.get(evtStandardStr) || isMagicNoteInput(evt));
    // 2. Magic/delayed hotkeys take precedence over non-delayed hotkeys.
    if (inMagicMode) {
      this.buffer.push(evt);
      window.setTimeout(() => this.magicHandle(), this.magicDelayMs);
      // No-op because we will handle it in handleKeyDownAfterReordering.
      return shouldPreventDefaultWithoutRerendering();
    }

    // 3. Non-delayed hotkeys.
    const action = this.hotkeyToAction.get(evtStandardStr);
    if (action) {
      return action(evt);
    }
    // 4. Fall-back to tsEditor default.
    // if (!evtIsLikelyInput(evt)) {
    if (!inMagicMode) {
      return this.tsEditor.defaultKeydownHandler(evt);
    }

    // 5. No-op
    return shouldPreventDefaultWithoutRerendering();
  }

  private magicHandle() {
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
      const magicAction = this.hotkeyToMagicAction.get(evtToStandardString(evt));
      if (magicAction) {
        const output = magicAction(evt);
        rerender ||= output.rerender;
      }
      const output = this.handleNoteInput(evt);
      rerender ||= output.rerender;
    });
    this.buffer = [];
    if (rerender) {
      this.tsEditor.render();
    }
  }

  handleBackspace() {
    const hasChanged = this.tsEditor.removeTextOrMoveBack(true);
    if (!hasChanged) {
      this.moveLeftOrUpRightWhereTextExists(true);
    };
    return shouldRerenderAndPreventDefault();
  }
  handleEnter() {
    if (!this.tsEditor.cursor.inTextMode) {
      this.tsEditor.enterTextMode();
    } else {
      this.handleTab();
    }
    return shouldRerenderAndPreventDefault();
  }

  handleNoteInput(evt: KeyboardEvent) {
    if (evtIsLikelyInput(evt)) {
      const possNoteNum = mapKeyToNoteNum(evt.key);
      if (possNoteNum) {
        const abc = noteNumToAbc(possNoteNum);
        this.handleTextInputWithPadding(abc);
        return shouldRerenderAndPreventDefault();
      }
    }
    return shouldPreventDefaultWithoutRerendering();
  }

  handleBacktick() {
    const numDividersInCell = (this.tsEditor.getCurrCell().text.match(/;/g) || []).length;
    // TODO Use meterDenom - 1 instead of 3.
    const hasEnoughDividers = numDividersInCell === 3;
    if (hasEnoughDividers) {
      return this.handleTab();
    }
    return this.handleAddDivider();
  }

  // Move left if there is text in any cells in the left.
  // Otherwise, move up one row to the right-most cell with content
  moveLeftOrUpRightWhereTextExists(removeCurrCellIfNonEssential=false) {
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
      const rowsBelow =this.tsEditor.textTable.cells.slice(oldRowIdx);
      const hasStuffBelow =rowsBelow.some(row => row.some(cell => !cell.isEmpty()));
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
      this.tsEditor.cursor.textIdx = getTextIdxOnTheLeft(
        this.tsEditor.getCurrCell().text, this.tsEditor.cursor.textIdx);;
      return shouldRerenderAndPreventDefault();
    }
    this.tsEditor.moveToLeftCell();
    return shouldRerenderAndPreventDefault();
  }
  handleRight() {
    const text = this.tsEditor.getCurrCell().text;
    if (this.tsEditor.cursor.inTextMode && this.tsEditor.cursor.textIdx < text.length) {
      this.tsEditor.cursor.textIdx = getTextIdxOnTheRight(
        text, this.tsEditor.cursor.textIdx);
      return shouldRerenderAndPreventDefault();
    }
    if (this.tsEditor.cursor.colIdx === this.numFullBarsPerRow) {
      return shouldRerenderAndPreventDefault();
    }
    this.tsEditor.moveToRightCell();
    return shouldRerenderAndPreventDefault();
  }
  handleTab() {
    if (this.tsEditor.cursor.colIdx < this.numFullBarsPerRow) {
      this.tsEditor.moveToRightCell();
      return shouldRerenderAndPreventDefault();
    }
    this.tsEditor.moveDownToLeftmostColumn();
    // Move right before the left-most cell is the pick-up bar.
    this.tsEditor.moveToRightCell();
    return shouldRerenderAndPreventDefault();
  }
  handleAddDivider() {
    return this.handleTextInputWithPadding(';');
  }
  handleAddProtraction() {
    return this.handleTextInputWithPadding('_');
  }

  handleTextInputWithPadding(text: string) {
    const cursor = this.tsEditor.cursor;
    let paddedText = ` ${text} `;
    if (!cursor.inTextMode || cursor.textIdx === 0) {
      paddedText = `${text} `;
    } else if (this.tsEditor.getCurrCell().text.slice(cursor.textIdx - 1, cursor.textIdx) === ' ') {
      paddedText = `${text} `;
    }
    return this.tsEditor.handleTextInput(paddedText);
  }
}

function isMagicNoteInput(evt: KeyboardEvent): boolean {
  if (isPossHotkey(evt)) {
    return false;
  }
  return mapKeyToNoteNum(evt.key) !== undefined;
}

function isPossHotkey(evt: KeyboardEvent): boolean {
  return evt.metaKey || evt.ctrlKey || evt.altKey || evt.shiftKey;
}