import "./tsModules/textarea-spreadsheet/tsUi"
import "./tsModules/music-spreadsheet/msUi"
import { setupGoogleAddOnActions } from "./googleAddOnActions";
import { isInGoogleAddOn } from "./tsModules/google-add-on/googleAddOn";
import { MsUi } from "./tsModules/music-spreadsheet/msUi";

export function main(data: string) {
  const mainDiv = document.getElementById('main') as HTMLDivElement;
  mainDiv.innerHTML = '';

  const msUiElt = document.createElement('music-spreadsheet-ui') as MsUi;
  mainDiv.appendChild(msUiElt);

  if (isInGoogleAddOn()) {
    setupGoogleAddOnActions(msUiElt.msEditor);
  }

}


