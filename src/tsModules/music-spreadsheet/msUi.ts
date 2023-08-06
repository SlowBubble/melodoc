import { TsUi } from "../textarea-spreadsheet/tsUi";
import { MsEditor } from "./msEditor";

export class MsUi extends HTMLElement {
  constructor(public msEditor: MsEditor, private renderHandler: Function | null = null) {
    super();
  }
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const tsUi = <TsUi>document.createElement('textarea-spreadsheet-ui');
    shadowRoot.appendChild(tsUi);
    const div = <HTMLDivElement>document.createElement('div');
    div.innerHTML = html;
    shadowRoot.appendChild(div);
    const iframe = <HTMLIFrameElement>shadowRoot.getElementById('sheet-music-iframe');
    this.msEditor = new MsEditor(tsUi.tsEditor);
    tsUi.tsEditor.onRender(() => {
      iframe.src = this.msEditor.getMidiChordSheetLink();
      if (this.renderHandler) {
        this.renderHandler();      
      }
    });
  }
  onRender(renderHandler: Function) {
    this.renderHandler = renderHandler;
  }
}

const html = `
<iframe id="sheet-music-iframe"
    title="Sheet Music"
    width="100%"
    height="450">
</iframe>
`
customElements.define('music-spreadsheet-ui', MsUi);