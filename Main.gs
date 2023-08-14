function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Create/Edit', 'showEditor')
      .addItem('Menu', 'showSidebar')
      .addToUi();
}

function showEditor() {
  var html = HtmlService.createTemplateFromFile('Editor').evaluate()
    .setWidth(1700)
    .setHeight(1200);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showModalDialog(html, 'Melodoc Editor');
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Melodoc Menu');
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showSidebar(html);

}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function addImageWithLink(blobInArray, url) {
  const body = DocumentApp.getActiveDocument().getBody();
  const blobSource = Utilities.newBlob(blobInArray);
  let para;
  const currElt = _getCurrElt();
  const childIdx = _findBodyChildIdxOfCurrElt(currElt);
  if (childIdx === null) {
    const paraIdx = _findBodyParagraphIdxOfCursorOrSelection();
    para = paraIdx === null ? body.insertParagraph(0, '') : body.getParagraphs()[paraIdx];
  } else {
    para = currElt.asParagraph();
  }

  para.clear();
  const inlineImage = para.appendInlineImage(blobSource);
  inlineImage.setLinkUrl(url);
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

// Private
// We assume that the cursor or selection is in a top-level child or paragraph.
// If not returns null.
// TODO support non-top-level paragraphs.
function _findBodyChildIdxOfCurrElt(currElt) {
  const body = DocumentApp.getActiveDocument().getBody();
  try {
    return body.getChildIndex(currElt);
  } catch (e) {
    // curElt is not in this body's child.
  }
  return null;
}
function _findBodyParagraphIdxOfCursorOrSelection() {
  const curElt = _getCurrElt();
  const body = DocumentApp.getActiveDocument().getBody();
  let resIdx = null;
  body.getParagraphs().forEach((para, idx) => {
    try {
      if (para.getChildIndex(curElt) >= 0) {
        resIdx = idx;
      }
    } catch (e) {
      // curElt is not in this paragraph.
    }
  });
  return resIdx;
}

function _getCurrElt() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    const rangeElts = selection.getRangeElements();
    if (rangeElts.length > 0) {
      return rangeElts[0].getElement();
    }
  }
  const cursor = DocumentApp.getActiveDocument().getCursor();
  if (cursor) {
    return cursor.getElement();
  }
  return null;
}
