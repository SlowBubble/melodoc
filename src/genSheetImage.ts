import { parseKeyValsToSongInfo } from "./esModules/sheet-to-song/parseV2.js";
import { RenderMgr } from "./esModules/sheet-to-song/render.js";

// declare const html2canvas: any;
declare const canvg: any;

// Requires tmp-sheet-container and tmp-sheet-canvasto be in the DOM.
export function genSheetImage(gridData: string[][], handler: BlobCallback) {
  const div = document.getElementById('tmp-sheet-container');
  if (!div) {
    return;
  }
  // 1. Render sheet music svg in div.
  const songInfo = parseKeyValsToSongInfo(gridData, {});
  const song = songInfo.songForm.toFullyArrangedSong();
  const renderMgr = new RenderMgr(div);
  renderMgr.render(song);

  const canvas =document.getElementById('tmp-sheet-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.log('failed to get 2d context')
    return;
  }
  const canvgInstance = canvg.Canvg.fromString(ctx, div.innerHTML);
  canvgInstance.start();
  canvas.toBlob(handler, 'image/png');

  // // 2. When the svg is loaded into img, draw the img into a canvas html.
  // const imgHtml = document.getElementById('tmp-sheet-img') as HTMLImageElement;
  // imgHtml.onerror = err => {
  //   console.log(err);
  // };
  // imgHtml.onload = () => {
  //   const canvas = document.createElement('canvas');
  //   const canvasCtx = canvas.getContext('2d');
  //   if (!canvasCtx) {
  //     console.log('failed to get 2d context')
  //     return;
  //   }
  //   canvas.width = imgHtml.clientWidth;
  //   canvas.height = imgHtml.clientHeight;
  //   canvasCtx.drawImage(imgHtml, 0, 0);

  //   canvas.toBlob(handler, 'image/png');
  // }

  // // 3. Load the svg into img
  // const svg = div.querySelector('svg');
  // const svgBlobUrl = URL.createObjectURL(new Blob([div.innerHTML], { type: 'image/svg+xml;charset=utf-8' }));
  // imgHtml.src = svgBlobUrl;


  // html2canvas(div.querySelector('svg')).then((canvas: HTMLCanvasElement) => {
  //   canvas.toBlob(handler, 'image/png');
  // });
}