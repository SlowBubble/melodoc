import { MsEditor } from "./tsModules/music-spreadsheet/msEditor";

declare const google: any;

export function setupGoogleAddOnActions(msEditor: MsEditor) {
  // TODO add a shortcut for resizing modal.
  document.getElementById('add-image-button')?.addEventListener(
    'keydown', () => addImageWithLinkToDoc(msEditor.getMelodocLink()));
  msEditor.customHotkeyToAction.set(
    'shift i', () => addImageWithLinkToDoc(msEditor.getMelodocLink()));
}

function onSuccess() {
  google.script.host.close();
}

function onFailure(error: Error) {
  alert(error.message);
}

export function addImageWithLinkToDoc(link: string) {
  const dialog = document.getElementById('inserting-dialog') as HTMLDialogElement;
  dialog.showModal();

  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    dialog.close();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 100);
  ctx.lineTo(200, 100);
  ctx.lineTo(200, 0);
  ctx.lineTo(0, 0);
  ctx.stroke();

  canvas.toBlob(async (blob: Blob | null) => {
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
