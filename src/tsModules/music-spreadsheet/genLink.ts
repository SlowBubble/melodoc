import { TextTable } from "../textarea-spreadsheet/textTable";
import { getChordRows, getVoiceRows } from "./parsingUtil";

export function genMidiChordSheetLink(textTable: TextTable) {
  const json = textTableToGridData(textTable);
  const jsonStr = JSON.stringify(json);
  return jsonStringToLink(jsonStr);
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

function jsonStringToLink(jsonStr: string) {
  const baseLink = 'https://slowbubble.github.io/MidiChordSheet/';
  const title = 'untitled';
  return `${baseLink}#displayNotes=1&title=${title}&data=${encodeURIComponent(jsonStr)}`
}
