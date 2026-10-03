function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.type === 'rsvp') {
      var sheet = ss.getSheetByName('RSVP');
      if (!sheet) {
        sheet = ss.insertSheet('RSVP');
        sheet.appendRow(['Timestamp', 'Nama', 'Status Kehadiran', 'Jumlah Tamu']);
      }
      sheet.appendRow([new Date(), data.name, data.attendance, data.guests]);
    } 
    else if (data.type === 'wish') {
      var sheet = ss.getSheetByName('Wishes');
      if (!sheet) {
        sheet = ss.insertSheet('Wishes');
        sheet.appendRow(['Timestamp', 'Nama', 'Ucapan']);
      }
      sheet.appendRow([new Date(), data.name, data.message]);
    }

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
