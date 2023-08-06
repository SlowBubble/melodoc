import "./tsModules/textarea-spreadsheet/tsUi"
import "./tsModules/music-spreadsheet/msUi"
import { setupGoogleAddOnActions } from "./googleAddOnActions";
import { isInGoogleAddOn } from "./tsModules/google-add-on/googleAddOn";
import { MsUi } from "./tsModules/music-spreadsheet/msUi";
import { TextTable } from "./tsModules/textarea-spreadsheet/textTable";
import { getUrlParamsMapFromString } from "./url";

export function main(url: string) {
  const mainDiv = document.getElementById('main') as HTMLDivElement;
  mainDiv.innerHTML = '';

  const msUiElt = document.createElement('music-spreadsheet-ui') as MsUi;
  mainDiv.appendChild(msUiElt);

  const urlParams = getUrlParamsMapFromString(url);
  const data = urlParams.has('data') ? urlParams.get('data') : '[]';

  // msUiElt.msEditor.tsEditor.textTable = TextTable.fromString(dataToTextAreaString(data))

  if (isInGoogleAddOn()) {
    setupGoogleAddOnActions(msUiElt.msEditor);
  }

}

function dataToTextAreaString(data: string) {
  return '| C | D ';
}
