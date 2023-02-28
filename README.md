
# TODO

# Doing

- Design how PianoKeyboard interacts with Editor via various interpreters
- BufferedInterpreter (if the cursor is at the start of a rest or blank space)
  - When a note is hit, updates the notes in the beat, but don't move the cursor until the enter key occurs.
  - When the enter key is hit, updates the notes in the beat, move the cursor and empty the buffer.
- AddOnInterpreter (if the cursor is at the start of a non-rest note or not on the beat)
  - When a note is hit, add the note onto the non-rest note.
  - For rest note, just insert the note until the next beat.

# Done

- set up public data interface using TS.
- set up workflow for web and add-on.