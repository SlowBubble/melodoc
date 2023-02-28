import { EditorOperation } from "../melodoc-editor/editorOps";

export interface InterpreterApi {
  noteDown: (noteNum: number) => EditorOperation[];
  noteUp: (noteNum: number) => EditorOperation[];
}

