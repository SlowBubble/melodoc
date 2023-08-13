import "./tsModules/textarea-spreadsheet/tsUi"
import "./tsModules/music-spreadsheet/msUi"
import { setupGoogleAddOnActions } from "./googleAddOnActions";
import { isInGoogleAddOn } from "./tsModules/google-add-on/googleAddOn";
import { MsUi } from "./tsModules/music-spreadsheet/msUi";
import { TextTable } from "./tsModules/textarea-spreadsheet/textTable";
import { getUrlParamsMapFromString, setUrlParam } from "./url";
import { getTitle, textTableToGridData } from "./tsModules/music-spreadsheet/genLink";
import { genSheetImage } from "./genSheetImage";

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
    msUiElt.msEditor.customHotkeyToAction.set('alt x', async _ => {
      const title = getTitle(msUiElt.msEditor.tsEditor.textTable);
      genSheetImage(textTableToGridData(msUiElt.msEditor.tsEditor.textTable), title, blob => {
        if (!blob) {
          return;
        }
        const item = {[blob.type]: blob};
        navigator.clipboard.write([new ClipboardItem(item),
        ]);
      });
    });
  }

}
