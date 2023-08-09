import { Cell } from "../textarea-spreadsheet/cell";

export function rowHasChord(row: Cell[]) {
  return row.some(cell => cell.text.includes('Chord:'));
}

export function rowHasVoice(row: Cell[]) {
  if (row.every(cell => !cell.text.includes(':'))) {
    return true;
  }
  return row.some(cell => cell.text.includes('Voice:'));
}

function cleanup(row:Cell[]) {
  return row.map(cell => cell.text.replace(/;/g, '|').replace(/.*:/g, '').trim());
}
export function getVoiceRows(rows: Cell[][]) {
  const res = rows.filter(rowHasVoice);
  if (res.length === 0) {
    return [['', '_']];
  }
  return res.map(row => cleanup(row));
}

export function getChordRows(rows: Cell[][]) {
  const res = rows.filter(rowHasChord);
  if (res.length === 0) {
    return [['', '_']];
  }
  return res.map(row => cleanup(row));
}