function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CSV Importer')
    .addItem('Open Importer', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('CSV Importer')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function import_CSV(selectedColumns, lines, importType) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (importType === 'new') {
    // Create a new sheet for import
    var newSheet = spreadsheet.insertSheet('Imported Data');
    var sheet = newSheet;
  } else {
    // Use the existing active sheet for import
    var sheet = spreadsheet.getActiveSheet();
  }

  // Create a mapping of selected columns to their corresponding indices
  var columnMap = {};
  for (var i = 0; i < selectedColumns.length; i++) {
    var columnIndex = parseInt(selectedColumns[i]);
    columnMap[columnIndex] = true;
  }

  // Iterate through the rows and insert data into the sheet, only for selected columns
  for (var i = 0; i < lines.length; i++) {
    var rowData = lines[i].split(',');
    var filteredData = [];

    // Filter the rowData to include only selected columns
    for (var j = 0; j < rowData.length; j++) {
      if (columnMap[j]) {
        filteredData.push(rowData[j]);
      }
    }

    // Append the filtered data to the sheet
    sheet.appendRow(filteredData);
  }

  // Return success message
  return 'success';
}

function getCSVColumnsFromDrive(url) {
  try {
    var fileId = getFileIdFromUrl(url);
    if (fileId) {
      var downloadUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
      var response = UrlFetchApp.fetch(downloadUrl);
      var csvData = response.getContentText();
      var lines = csvData.split('\n');
      var headerRow = lines[0];
      var columnNames = headerRow.split(',');
      return columnNames;
    } else {
      console.error("Invalid Google Drive URL.");
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

function getFileIdFromUrl(url) {
  var fileIdMatch = /\/d\/([a-zA-Z0-9-_]+)/.exec(url);
  return fileIdMatch ? fileIdMatch[1] : null;
}
