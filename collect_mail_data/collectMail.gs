/**
 * Creates two time-driven triggers.
 * @see https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers
 */
function createTimeDrivenTriggers() {
  const allTriggers = ScriptApp.getProjectTriggers();
  let has_trigger = false;
  for (let index = 0; index < allTriggers.length; index++) {
    // If the current trigger is the correct one, delete it.
    if (allTriggers[index].getUniqueId() === 'myFunction') {
      has_trigger = true;
      break;
    }
  }

  if (!has_trigger) {
    // Trigger every 1 hours.
    ScriptApp.newTrigger('myFunction')
        .timeBased()
        .everyHours(1)
        .create();
  }
  myFunction();
}

function myFunction() {
  const threads = GmailApp.search('-label:"Categorized"', 0, 50);

  const SERVER_URL = "https://inferenceapi-a6xvnhojvq-an.a.run.app"
  const id2label = JSON.parse(UrlFetchApp.fetch(`${SERVER_URL}/labels`).getContentText('UTF-8')).labels;

  Logger.log(id2label);

  let gmailApps = {};
  for (const key in id2label) {
    if (!GmailApp.getUserLabelByName(id2label[key])) {
      GmailApp.createLabel(id2label[key]);
    }
    gmailApps[key] = GmailApp.getUserLabelByName(id2label[key]);
  }
  if (!GmailApp.getUserLabelByName("Categorized")) {
    GmailApp.createLabel("Categorized");
  }
  let categorized_label = GmailApp.getUserLabelByName("Categorized");

  for (let i = 0 ; i < threads.length; i++) {
    const msgs = GmailApp.getMessagesForThread(threads[i]);

    Logger.log(msgs[0].getSubject());

    let mail_address_with_square = msgs[0].getFrom().match(/<.*>/);
    let mail_address = ""
    if (mail_address_with_square) {
      mail_address = mail_address_with_square[0].slice(1, -1);
    } else {
      mail_address = msgs[0].getFrom();
    }

    // Make a POST request with a JSON payload.
    const data = {
      'content': `${mail_address}[SEP]${msgs[0].getSubject()}`
    };
    const options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data)
    };
    const res = JSON.parse(UrlFetchApp.fetch(`${SERVER_URL}/predict`, options).getContentText('UTF-8'));
    Logger.log(`prediction: ${res.prediction}`)
    
    gmailApps[res.prediction].addToThread(threads[i])

    categorized_label.addToThread(threads[i])
  }
}
