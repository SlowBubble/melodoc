import "./tsModules/textarea-spreadsheet/tsUi"
import "./tsModules/music-spreadsheet/msUi"
import { setupGoogleAddOnActions } from "./googleAddOnActions";
import { isInGoogleAddOn } from "./tsModules/google-add-on/googleAddOn";
import { MsUi } from "./tsModules/music-spreadsheet/msUi";
import { TextTable } from "./tsModules/textarea-spreadsheet/textTable";
import { getUrlParamsMapFromString, setUrlParam } from "./url";

export function main(url: string) {
  const mainDiv = document.getElementById('main') as HTMLDivElement;
  mainDiv.innerHTML = '';

  const msUiElt = document.createElement('music-spreadsheet-ui') as MsUi;
  mainDiv.appendChild(msUiElt);

  const urlParams = getUrlParamsMapFromString(url);
  const data = urlParams.has('data') ? urlParams.get('data') : '';
  msUiElt.msEditor.tsEditor.textTable = TextTable.fromString(data);
  msUiElt.msEditor.tsEditor.render();

  if (isInGoogleAddOn()) {
    setupGoogleAddOnActions(msUiElt.msEditor);
  } else {
    msUiElt.onRender(() => {
      const textContent = msUiElt.msEditor.tsEditor.textTable.toString(true);
      setUrlParam('data', textContent);
    });
  }

}
