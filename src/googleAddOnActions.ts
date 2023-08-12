import { genSheetImage } from "./genSheetImage";
import { textTableToGridData } from "./tsModules/music-spreadsheet/genLink";
import { MsEditor } from "./tsModules/music-spreadsheet/msEditor";

declare const google: any;

export function setupGoogleAddOnActions(msEditor: MsEditor) {
  // TODO add a shortcut for resizing modal.
  document.getElementById('add-image-button')?.addEventListener(
    'keydown', _ => addLinkedImageToDoc(msEditor));
  msEditor.customHotkeyToAction.set(
    'alt x', _ => addLinkedImageToDoc(msEditor));
  // Autofocus does not work for google add-on, so focus explicitly.
  msEditor.tsEditor.textarea.focus();
}

function onSuccess() {
  google.script.host.close();
}

function onFailure(error: Error) {
  alert(error.message);
}

function addLinkedImageToDoc(msEditor: MsEditor) {
  const dialog = document.getElementById('inserting-dialog') as HTMLDialogElement;
  dialog.showModal();

  const link = msEditor.getMelodocLink();
  genSheetImage(textTableToGridData(msEditor.tsEditor.textTable), async blob => {
    if (!blob) {
      dialog.close();
      return;
    }
    const blobInArray = Array.from(new Uint8Array(await blob.arrayBuffer()));
    google.script.run
      .withSuccessHandler(onSuccess)
      .withFailureHandler(onFailure)
      .addImageWithLink(blobInArray, link);
  });
}
