import { MsEditor } from "./tsModules/music-spreadsheet/msEditor";

declare const google: any;

export function setupGoogleAddOnActions(msEditor: MsEditor) {
  // TODO add a shortcut for resizing modal.
  document.getElementById('add-image-button')?.addEventListener(
    'keydown', () => addImageToDoc());
  msEditor.customHotkeyToAction.set('shift i', () => addImageToDoc())
  

}

function onSuccess() {
  google.script.host.close();
}

export function addImageToDoc() {
  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  ctx.beginPath();
  ctx.arc(100, 75, 50, 0, 2 * Math.PI);
  ctx.stroke();
  canvas.toBlob(async (blob: Blob | null) => {
    if (!blob) {
      return;
    }
    const blobInArray = Array.from(new Uint8Array(await blob.arrayBuffer()));
    google.script.run
      .withSuccessHandler(onSuccess)
      // .withFailureHandler(onFailure)
      .addImageWithLink(blobInArray);
  });
  
}
