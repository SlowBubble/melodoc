
var fs = require('fs');
var srcPath = './build/googleAddOnMain.js'; 
var destPath = `${srcPath}.html`; 

function overWrite(path, data) {
  fs.writeFileSync(path, data);
}

function append(path, data) {
  fs.writeFileSync(path, data, {
    flag: "a+",
  });
}

overWrite(destPath, "<script>");
append(destPath, "\n");
append(destPath, fs.readFileSync(srcPath));
append(destPath, "\n");
append(destPath, "</script>");
