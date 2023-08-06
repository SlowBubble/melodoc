# Goal

- Build a spreadsheet editor inside a textarea HTML element.
- It should be a UI component that another more complex editor can use

# TODO

## Doc Add-On

- Once P0 of MsEditor is done, use that as the image's link so I can parse it into the add-on.

### P2
- When selecting a image with the correct link, open with the loaded data

- Will follow up with a good image in the next iteration
  - Need to port over the minimum amount of code to generate abc js stuff.
  - Then html2canvas can take a screenshot of the svg.

## MsEditor

### P0
- Add #data='${textarea.textContent}' to the url and parse it

### P1

- Adding chords: Should we re-design how to denote a chords row?
  - Chords_A    | C  | Am | Dm | G
  - (Voice_0) /G | C  |
  - (Voice_1)    | G  |
- Add buttons that will add row with Chords_?
- Add buttons to add or modify headers.

### P2

- enharmonic
  - Unfortunately, this will not be reflected in the sheet music, just the textarea.
- up/down arrow
- Delete: remove token to the right in the same cell.
- Think of shortcuts to add a row or remove a row
  - push things to the next cell (snake-push and snake-pull)
- Tab or enter: add _ for the cell it is exiting
  - Requires understanding which part we are in
- When cursor is in text mode, cursor should move to the right of next white space
  - or exit text mode and go to next cell.
- shortcut to copy previous cell.

## MidiChordSheet

- Handle cells with nothing
- Handle song with only voice and no chords (i.e. part)

### P3
- Deploy a version of MidiChordSheet that use standard classical notation.

## TsEditor
- applyLint when not in text mode, should remove redundant spaces for each column.

- Implement backspace in the left-most cell (moveLeftOrUpAndRight)
- On click: use the selection range to determine which cell the cursor should be on.

# Done
## Doc Add-On
- Generate a blank image with the link.

## MsEditor

## TsEditor