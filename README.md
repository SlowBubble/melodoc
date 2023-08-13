# Goal

- Create and edit sheet music as quick as possible.

# How

- Create a Google Doc add-on to edit sheet music in a spreadsheet-like editor.
  - This makes it easy to persist the data without me maintaining a DB.
  - Allow adding notes/comments to the sheet music.
- The web app will just provide a way to share the sheet music publicly
  - There is no new functionalities it brings other than being able to access
    - the image without using Google Doc
    - the sound and editor without using the add-on.
  - It also makes dev work quicker, without pushing code to the add-on.
  - In the future, we can configure the web app to point to publicly hosted files for music listening.

# Melodoc syntax

Chord:    | Cmaj7                 | Gm7 C7                   | Fmaj7                         | Fm7 Bb7          
; ; ; G E | /B ; ; ; /G /A        | /Bb A ; A A ; A G ; E C  | /A ; ; _ /E /F ; /A C E       | G G ; _ F ; G ; F
Chord:    | Cmaj7 Am7             | Dm7 G7                   | C6                           
          | E ; _ F G ; C ; _ D E | F /A ; _ /A ; /B C ; _ D | C ; ; ;   

# TODO

- X: Title
  - Try chinese
- enharmonic

## Open question

### Answered
- Is it worth having shift+key shortcuts by applying it when not in text mode? No
  - In non-melody cell, we do need shift+key for text entry without entering text mode.
  - The issue is that I don't pay attention to whether or not I'm in text mode.
- Url data is encoded using x-www-form-urlencoded format. Is that good? Yes
  - It is more readable than that of encodeURIComponent.
  - Will see if Chinese is okay using this encoding.

## Doc Add-On

- Use a sidebar to open things.

### P3
- Should we support inserting at a non-top-level location?
  - It's hard, so may be P3.

## MsEditor
### P1

- backspace: will remove the entire line if empty.
- Think of what shortcuts I should use to add headers.
  - Need to make the header names discoverable.
- enharmonic
  - Unfortunately, this will not be reflected in the sheet music, just the textarea. (see if I can fix it)

### P2

- up/down arrow
- Delete: remove token to the right in the same cell.
- Think of shortcuts to add a row or remove a row
  - push things to the next cell (snake-push and snake-pull)
- Tab or enter: add _ for the cell it is exiting
  - Requires understanding which part we are in
- When cursor is in text mode, cursor should move to the right of next white space
  - or exit text mode and go to next cell.
- textarea.style.whiteSpace = 'nowrap';
  - Need to automatically apply textarea.scrollLeft though.

## MidiChordSheet

- Treat cells with nothing as | _ |
- Handle song with only voice and no chords (i.e. part)

### P3
- Deploy a version of MidiChordSheet that use standard classical notation.

## TsEditor

- Implement backspace in the left-most cell (moveLeftOrUpAndRight)
- On click: use the selection range to determine which cell the cursor should be on.

# Done


