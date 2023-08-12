
var fs = require('fs');

main();

function main() {
  const srcAndDestPaths = [
    ['./build/googleAddOnMain.js', './build/googleAddOnMain.js.html'],
    ['./lib/abcjs-basic.js', './build/abcjs.js.html'],
    ['./lib/canvg.js', './build/canvg.js.html'],
    ['./src/esModules/sheet-melody/nearley.js', './build/nearley.js.html'],
    ['./src/esModules/sheet-melody/melodicCell.js', './build/melodicCell.js.html'],
    ['./src/esModules/chord/chordParser.js', './build/chordParser.js.html'],
  ];
  srcAndDestPaths.forEach(
    srcAndDestPath => convertJsToHtml(srcAndDestPath[0], srcAndDestPath[1]));
}

function convertJsToHtml(srcPath, destPath) {
  overWrite(destPath, "<script>");
  append(destPath, "\n");
  append(destPath, fs.readFileSync(srcPath));
  append(destPath, "\n");
  append(destPath, "</script>");
}

function overWrite(path, data) {
  fs.writeFileSync(path, data);
}

function append(path, data) {
  fs.writeFileSync(path, data, {
    flag: "a+",
  });
}




