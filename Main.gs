function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Create/Edit', 'showEditor')
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

function addImageWithLink(blobInArray, url) {
  const body = DocumentApp.getActiveDocument().getBody();
  const inlineImage = body.appendImage(Utilities.newBlob(blobInArray));
  inlineImage.setLinkUrl(url)
}

function getLinkPointedToByCursor() {
  const noLink = '';
  const range = DocumentApp.getActiveDocument().getSelection();
  if  (!range) {
    return noLink;
  }
  const rangeElts = range.getRangeElements();
  for (let i = 0; i < rangeElts.length; i++) {
    var elt = rangeElts[i].getElement();
    try {
      return elt.asInlineImage().getLinkUrl();
    } catch (e) {
      // The selected element is not an image.
      console.log(e);
    }
  }
  return noLink;
}
