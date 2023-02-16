function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Create', 'showEditor')
      .addToUi();
}

function showEditor() {
  var html = HtmlService.createTemplateFromFile('Editor').evaluate()
    .setWidth(800)
    .setHeight(800);
  DocumentApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .showModalDialog(html, 'Melodoc Editor');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
