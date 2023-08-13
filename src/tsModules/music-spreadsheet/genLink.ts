import { Cell } from "../textarea-spreadsheet/cell";
import { TextTable } from "../textarea-spreadsheet/textTable";
import { getChordRows, getVoiceRows } from "./parsingUtil";

export function genMidiChordSheetLink(textTable: TextTable) {
  const json = textTableToGridData(textTable);
  const jsonStr = JSON.stringify(json);
  return jsonStringToLink(jsonStr, getTitle(textTable));
}

export function textTableToGridData(textTable: TextTable) {
  const res = [
    ['', 'Key: C'],
    ['', 'Meter: 4/4'],
    ['', 'Tempo: 180'],
    ['', 'Part: A'],
  ];
  res.push(...getChordRows(textTable.cells));
  res.push(['', 'Voice: A']);
  res.push(...getVoiceRows(textTable.cells));
  return res;
}

function jsonStringToLink(jsonStr: string, title: string) {
  const baseLink = 'https://slowbubble.github.io/MidiChordSheet/';
  return `${baseLink}#displayNotes=1&title=${title}&data=${encodeURIComponent(jsonStr)}`
}

export function getTitle(textTable: TextTable) {
  const cell = getTitleCell(textTable);
  return cell ? cell.text.replace('Title:', '').trim() : 'Untitled';
}

export function getTitleCell(textTable: TextTable): Cell | null {
  let resCell = null;
  textTable.getCellsInArray().forEach(cell => {
    if (cell.text.startsWith('Title:')) {
      resCell = cell;
    }
  });
  return resCell;
}

