// https://support.google.com/mail/answer/7190?hl=en#:~:text=Messages%20in%20a%20certain%20category
// category:primary
// category:social
// category:promotions
// category:updates
// category:forums
// category:reservations
// category:purchases

function myFunction() {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName('test3');

  sheet.getRange(1, 1).setValue("from");
  sheet.getRange(1, 2).setValue("title");
  sheet.getRange(1, 3).setValue("content");
  sheet.getRange(1, 4).setValue("label");

  const categories = ['primary']

  let column_start_index = 0
  for (let c = 0; c < categories.length; c++) {
    for (let k = 0; k < 2; k++) {
      column_start_index = 500*(2*c+k)
      // まとめて行追加した方が速い
      sheet.insertRowsAfter(column_start_index+2, 500)
      const threads = GmailApp.search(`category:${categories[c]}`, 500*k, 500);

      for (let i = 0 ; i < threads.length; i++) {
        const msgs = GmailApp.getMessagesForThread(threads[i]);
        // Logger.log(`${categories[c]}: ` + msgs[0].getSubject());

        const regex = /<.*>/;
        let mail_address_with_square = msgs[0].getFrom().match(regex);
        let mail_address = ""
        if (mail_address_with_square) {
          mail_address = mail_address_with_square[0].slice(1, -1);
        } else {
          mail_address = msgs[0].getFrom();
        }
        sheet.getRange(column_start_index+2+i, 1).setValue(mail_address);
        sheet.getRange(column_start_index+2+i, 2).setValue(msgs[0].getSubject());
        sheet.getRange(column_start_index+2+i, 3).setValue(msgs[0].getPlainBody());
        sheet.getRange(column_start_index+2+i, 4).setValue(categories[c]);
      }
    }
  }
}
