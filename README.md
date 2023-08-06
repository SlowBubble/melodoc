# Goal

- Create and edit sheet music as quick as possible.

# How

- Create an Google Doc add-on to edit sheet music in a spreadsheet like editor.
  - This makes it easy to persist the data.
  - Allow adding notes/comments to the sheet music.
- The Web App will just provide a way to share the sheet music publicly
  - There is no new functionalities it brings other than being able to access
    - the image without using Google Doc
    - the sound and editor without using the add-on.

# TODO

- Replace or insert image instead of appending

- TsEditor: applyLint when not in text mode, should remove redundant spaces for each column.

- Adding chords


## Doc Add-On
### P2
 
- Will follow up with a good image in the next iteration
  - Need to port over the minimum amount of code to generate abc js stuff.
  - Then html2canvas can take a screenshot of the svg.

## MsEditor
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

- Note: url data is encoded using x-www-form-urlencoded format.
  - This is more readable than that of encodeURIComponent.

## Doc Add-On

## MsEditor

## TsEditor