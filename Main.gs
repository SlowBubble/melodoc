function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Create', 'showEditor')
      .addToUi();
}

function showEditor() {
  var html = HtmlService.createTemplateFromFile('Editor').evaluate()
    .setWidth(1200)
    .setHeight(1200);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showModalDialog(html, 'Melodoc Editor');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function addImageWithLink(blobInArray) {
  const body = DocumentApp.getActiveDocument().getBody();
  return body.appendImage(Utilities.newBlob(blobInArray));
  // setLinkUrl(url)
  // const cursor = DocumentApp.getActiveDocument().getCursor();
  // cursor.insertText('hello');
  // console.log(blobInArray[0]);
  // console.log(Utilities.newBlob(blobInByteArray));
  // cursor.insertInlineImage(Utilities.newBlob(blobInArray));

}
