/**
 * Google Apps Script Webhook for Practo for Animals Lead Capture
 * 
 * Handles incoming lead submissions from LeadCaptureModal.tsx
 * Appends row to active Google Sheet tab "Practo Leads"
 * Optional email confirmation via MailApp (default: OFF)
 */

// Configuration flags
var CONFIG = {
  SHEET_NAME: 'Practo Leads',
  ENABLE_EMAIL_CONFIRMATION: false, // Set to true to send learner confirmation emails
  SENDER_NAME: 'Practo for Animals Care Team',
  HEADERS: [
    'Timestamp',
    'Name',
    'WhatsApp',
    'Email',
    'Role',
    'Interests',
    'Batch',
    'Intent',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'Page'
  ]
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent write safety
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return createJsonResponse({ ok: false, error: 'Server busy, lock timeout' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ ok: false, error: 'Missing post data payload' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({ ok: false, error: 'Malformed JSON payload' });
    }

    // Honeypot anti-spam check: ignore requests where the hidden "website_url" field is filled
    if (data.website_url && String(data.website_url).trim() !== '') {
      // Return ok:true silently to foil automated bots
      return createJsonResponse({ ok: true, dropped: 'honeypot' });
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    // Create the sheet tab if it doesn't already exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    }

    // If sheet is completely empty, insert header row and format it
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(CONFIG.HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, CONFIG.HEADERS.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#0F766E'); // Primary brand teal
      headerRange.setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }

    // Normalize field values
    var timestamp = data.timestamp || new Date().toISOString();
    var name = data.name || '';
    var whatsapp = data.whatsapp || '';
    var email = data.email || '';
    var role = data.role || '';
    var interests = Array.isArray(data.interests) ? data.interests.join(', ') : (data.interests || '');
    var batch = data.batch || '';
    var intent = data.intent || 'seat';
    var utmSource = data.utm_source || '';
    var utmMedium = data.utm_medium || '';
    var utmCampaign = data.utm_campaign || '';
    var page = data.page || '';

    // Append lead row
    sheet.appendRow([
      timestamp,
      name,
      whatsapp,
      email,
      role,
      interests,
      batch,
      intent,
      utmSource,
      utmMedium,
      utmCampaign,
      page
    ]);

    // Optional confirmation email
    if (CONFIG.ENABLE_EMAIL_CONFIRMATION && email && email.indexOf('@') !== -1) {
      sendConfirmationEmail(email, name, intent, batch);
    }

    return createJsonResponse({ ok: true });
  } catch (err) {
    return createJsonResponse({ ok: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Creates JSON response via ContentService with correct MIME type
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional email dispatcher via MailApp
 */
function sendConfirmationEmail(recipientEmail, recipientName, intent, batchLabel) {
  try {
    var subject = intent === 'syllabus'
      ? 'Your Practo for Animals AI Course Syllabus'
      : 'Enrolment Confirmed — Practo for Animals AI Intensive';

    var body = intent === 'syllabus'
      ? 'Hi ' + (recipientName || 'there') + ',\n\n' +
        'Thank you for your interest in the Practo for Animals Applied AI Intensive.\n\n' +
        'You can access the full curriculum, module breakdown, and capstone project specs directly on the platform.\n\n' +
        'If you have any questions or would like to reserve your seat in the founding cohort, simply reply to this email.\n\n' +
        'Warm regards,\n' + CONFIG.SENDER_NAME
      : 'Hi ' + (recipientName || 'there') + ',\n\n' +
        'Thank you for reserving your seat in the Practo for Animals Applied AI Intensive (' + (batchLabel || 'Upcoming Cohort') + ').\n\n' +
        'Our admissions team has logged your interest. We will share your welcome pack, batch calendar invite, and private community invite prior to the start date.\n\n' +
        'Warm regards,\n' + CONFIG.SENDER_NAME;

    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      body: body,
      name: CONFIG.SENDER_NAME
    });
  } catch (emailErr) {
    Logger.log('Email delivery failed: ' + emailErr.toString());
  }
}
