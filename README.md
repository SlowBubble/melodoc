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

- See if document.body.addEventListener works for "shift i".
- Replace or insert image instead of appending
  - currElt = DocumentApp.getActiveDocument().getSelection()?.getRangeElements()[0].getElement()
  - currElt = DocumentApp.getActiveDocument().getCursor()?.getElement()?
  - currEltIdx = DocumentApp.getActiveDocument().getBody().getChildIndex(currElt)
  - DocumentApp.getActiveDocument().getBody().removeChild(currElt) 
  - insertImage(currEltIdx, image) 

- Get a good image.
  - Do something quick that can be added/removed easily.


## Open question

- Is it worth having shift+key shortcuts by applying it when not in text mode? No
  - In non-melody cell, we do need shift+key for text entry without entering text mode.
  - The issue is that I don't pay attention to whether or not I'm in text mode.

## Doc Add-On
### P2
 
- Will follow up with a good image in the next iteration
  - Need to port over the minimum amount of code to generate abc js stuff.

## MsEditor
### P1

- backspace: will remove the entire line if empty.
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

- Note: url data is encoded using x-www-form-urlencoded format.
  - This is more readable than that of encodeURIComponent.
