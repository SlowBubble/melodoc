import { MelodocUi } from "./MelodocUi";


export function main(data: string) {
  customElements.define("melodoc-ui", MelodocUi);

  const mainDiv = document.getElementById('main') as HTMLDivElement;
  mainDiv.innerHTML = '';
  const melodocUi = document.createElement('melodoc-ui') as MelodocUi;
  mainDiv.appendChild(melodocUi);
  melodocUi.loadSerializedData(data);
}

