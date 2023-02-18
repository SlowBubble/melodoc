import { MelodocEditor } from "./MelodocEditor";

export class MelodocUi extends HTMLElement {
  editor: MelodocEditor;
  constructor() {
    super();
    this.editor = new MelodocEditor();
  }
  connectedCallback() {
    this.innerHTML = `MelodocUi`;
  }
  loadSerializedData(data: string) {
    this.innerHTML = data;
  }
}
