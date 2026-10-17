/**
 * DHARSON HOSPITAL - GOOGLE APPS SCRIPT APPOINTMENT ENGINE
 * Speciality: Orthopaedics / Bone & Joint Care
 * Location: Namakkal, Tamil Nadu, India
 * 
 * Paste this entire code into your Apps Script Project editor at:
 * https://script.google.com/u/0/home/projects/1cfEUSpp7HJl6r8gryFUaiUECZcfwCbFExWZl1pphhoe3oQNBXJ-e2hmm/edit
 */

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  HOSPITAL_NAME: "Dharson Hospital",
  LOCATION: "Namakkal, Tamil Nadu",
  
  // OPTIONAL: Specify an existing Google Sheet ID here (from sheet URL).
  // Leave empty ("") to automatically create a new sheet named "Dharson Hospital - Patient Appointments"
  SPREADSHEET_ID: "", 

  SHEET_NAME: "Appointments",

  // Email address to receive instant appointment notifications
  // (e.g. hospital reception or coordinator email). Defaults to script owner.
  NOTIFICATION_EMAIL: "", // Leave blank to send to your Google account email

  // Send an automated confirmation receipt to the patient if email is provided
  SEND_PATIENT_CONFIRMATION: true,

  // Hospital phone number for patient emails
  HOSPITAL_PHONE: "+91 XXXXX XXXXX"
};

// ============================================================================
// WEBHOOK HANDLERS (doPost & doGet)
// ============================================================================

/**
 * Handles POST requests from the Dharson Hospital website appointment form
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // 10s lock to avoid concurrent write collisions

  try {
    var payload = parsePayload(e);

    if (!payload.name || !payload.phone) {
      return jsonResponse({
        status: "error",
        message: "Missing required patient name or phone number"
      });
    }

    // Auto-generate reference code if not provided
    var refCode = payload.refCode || ("DHAR-2026-" + Math.floor(1000 + Math.random() * 9000));
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MMM-yyyy hh:mm:ss a");

    // 1. Save appointment record to Google Sheet
    var sheet = getOrCreateAppointmentsSheet();
    sheet.appendRow([
      timestamp,
      refCode,
      payload.name || "",
      "'" + String(payload.phone || ""), // Prefix with ' to preserve leading zeroes
      payload.email || "",
      payload.date || "",
      payload.treatment || "General Orthopaedics",
      payload.message || "",
      "New (Pending Review)",
      "" // Admin notes column
    ]);

    // 2. Send email notification to hospital administration
    sendHospitalNotificationEmail({
      timestamp: timestamp,
      refCode: refCode,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      date: payload.date,
      treatment: payload.treatment,
      message: payload.message
    });

    // 3. Optional: Send confirmation email to patient
    if (CONFIG.SEND_PATIENT_CONFIRMATION && payload.email && payload.email.indexOf("@") !== -1) {
      sendPatientConfirmationEmail({
        refCode: refCode,
        name: payload.name,
        date: payload.date,
        treatment: payload.treatment
      }, payload.email);
    }

    return jsonResponse({
      status: "success",
      message: "Appointment request registered successfully",
      refCode: refCode,
      timestamp: timestamp
    });

  } catch (error) {
    Logger.log("Error processing appointment: " + error.toString());
    return jsonResponse({
      status: "error",
      message: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handles GET requests to verify that the Web App is online
 */
function doGet(e) {
  return jsonResponse({
    status: "online",
    hospital: CONFIG.HOSPITAL_NAME,
    speciality: "Orthopaedics & Bone Joint Care",
    location: CONFIG.LOCATION,
    service: "Appointment Booking Webhook",
    serverTime: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MMM-yyyy hh:mm:ss a")
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parses incoming POST data (supports JSON text, FormData, and URL-encoded parameters)
 */
function parsePayload(e) {
  var data = {};
  if (!e) return data;

  if (e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (jsonErr) {
      // If not JSON, check parameters
      if (e.parameter) {
        data = e.parameter;
      }
    }
  } else if (e.parameter) {
    data = e.parameter;
  }

  return data;
}

/**
 * Generates JSON text output for CORS-friendly responses
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Retrieves the Google Sheet or automatically creates and styles one
 */
function getOrCreateAppointmentsSheet() {
  var ss = null;

  // 1. Try active spreadsheet if script is attached directly to a Sheet
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    ss = null;
  }

  // 2. Safely parse SPREADSHEET_ID if provided (supports raw ID or full Google Sheet URL)
  var rawId = "";
  if (typeof CONFIG !== 'undefined' && CONFIG && CONFIG.SPREADSHEET_ID) {
    rawId = String(CONFIG.SPREADSHEET_ID).trim();
  }

  // Extract ID if user pasted full URL (e.g. https://docs.google.com/spreadsheets/d/XXXX/edit)
  var match = rawId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  var targetId = match ? match[1] : rawId;

  if (targetId && targetId !== "" && targetId.length > 5) {
    try {
      ss = SpreadsheetApp.openById(targetId);
    } catch (openErr) {
      Logger.log("Could not open sheet with ID " + targetId + ": " + openErr.toString());
      ss = null;
    }
  }

  // 3. Check Script Properties cache
  if (!ss) {
    try {
      var scriptProperties = PropertiesService.getScriptProperties();
      var savedSheetId = scriptProperties.getProperty("APPOINTMENTS_SPREADSHEET_ID");
      if (savedSheetId) {
        ss = SpreadsheetApp.openById(savedSheetId);
      }
    } catch (propErr) {
      ss = null;
    }
  }

  // 4. Create new spreadsheet if none exists
  if (!ss) {
    try {
      ss = SpreadsheetApp.create("Dharson Hospital - Patient Appointments");
      PropertiesService.getScriptProperties().setProperty("APPOINTMENTS_SPREADSHEET_ID", ss.getId());
    } catch (createErr) {
      Logger.log("Failed to create spreadsheet: " + createErr.toString());
      throw new Error("Unable to create Google Sheet. Please check permissions: " + createErr.message);
    }
  }

  var sheetName = (typeof CONFIG !== 'undefined' && CONFIG && CONFIG.SHEET_NAME) ? String(CONFIG.SHEET_NAME) : "Appointments";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // Create header row if empty
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp (IST)",
      "Reference Code",
      "Patient Name",
      "Phone Number",
      "Email Address",
      "Preferred Date",
      "Treatment / Concern",
      "Symptoms / Notes",
      "Status",
      "Admin Notes / Action"
    ];

    sheet.appendRow(headers);

    // Style the header
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0F2856"); // Dharson Navy Blue
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");

    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);

    // Set column widths
    sheet.setColumnWidth(1, 170); // Timestamp
    sheet.setColumnWidth(2, 140); // Ref Code
    sheet.setColumnWidth(3, 160); // Patient Name
    sheet.setColumnWidth(4, 130); // Phone Number
    sheet.setColumnWidth(5, 180); // Email
    sheet.setColumnWidth(6, 120); // Date
    sheet.setColumnWidth(7, 180); // Treatment
    sheet.setColumnWidth(8, 220); // Symptoms
    sheet.setColumnWidth(9, 140); // Status
    sheet.setColumnWidth(10, 180); // Notes
  }

  return sheet;
}

/**
 * Sends rich HTML email notification to hospital staff
 */
function sendHospitalNotificationEmail(data) {
  var recipient = CONFIG.NOTIFICATION_EMAIL || Session.getEffectiveUser().getEmail();
  var subject = "🏥 [Dharson Hospital] New Appointment: " + data.refCode + " - " + data.name;

  var htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; color: #1E293B;">
      <div style="background-color: #0F2856; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px; font-weight: bold;">Dharson Hospital</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #93C5FD; text-transform: uppercase; letter-spacing: 1px;">Orthopaedics & Bone Joint Care • Namakkal</p>
      </div>

      <div style="padding: 24px; background-color: #ffffff;">
        <div style="background-color: #EFF6FF; border-left: 4px solid #2563EB; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
          <strong style="color: #1E40AF; font-size: 16px;">New Patient Consultation Request</strong><br>
          <span style="font-size: 13px; color: #475569;">Received on: ${data.timestamp}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; width: 140px; font-weight: 600;">Reference Code:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-weight: bold; color: #0F2856;">${data.refCode}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Patient Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-weight: bold;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Phone Number:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9;">
              <a href="tel:${data.phone}" style="color: #0D9488; font-weight: bold; text-decoration: none;">${data.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Email Address:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9;">${data.email || "Not Provided"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Preferred Date:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-weight: 600; color: #2563EB;">${data.date}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Treatment / Concern:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9;">${data.treatment}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748B; font-weight: 600; vertical-align: top;">Symptoms / Notes:</td>
            <td style="padding: 10px 0; color: #334155;">${data.message || "None provided"}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="tel:${data.phone}" style="display: inline-block; background-color: #0F2856; color: #ffffff; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 14px;">
            📞 Call Patient Now
          </a>
        </div>
      </div>

      <div style="background-color: #F8FAFC; padding: 14px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0;">
        Dharson Hospital • Namakkal, Tamil Nadu, India • Automated Notification
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (mailErr) {
    Logger.log("Failed to send admin notification email: " + mailErr.toString());
  }
}

/**
 * Sends a confirmation receipt email to the patient
 */
function sendPatientConfirmationEmail(data, patientEmail) {
  var subject = "Your Appointment Request at Dharson Hospital [Ref: " + data.refCode + "]";

  var htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; color: #1E293B;">
      <div style="background-color: #0F2856; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px; font-weight: bold;">Dharson Hospital</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #93C5FD;">Orthopaedics & Bone Joint Care • Namakkal</p>
      </div>

      <div style="padding: 24px; background-color: #ffffff;">
        <h3 style="color: #0F2856; margin-top: 0;">Dear ${data.name},</h3>
        <p style="color: #475569; line-height: 1.6;">
          Thank you for reaching out to Dharson Hospital. We have successfully received your orthopaedic consultation request.
        </p>

        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <div style="font-size: 13px; color: #64748B;">Your Appointment Reference Code:</div>
          <div style="font-size: 20px; font-weight: bold; color: #0F2856; letter-spacing: 1px; margin-top: 4px;">${data.refCode}</div>
          <div style="font-size: 13px; color: #475569; margin-top: 8px;">
            <strong>Requested Concern:</strong> ${data.treatment}<br>
            <strong>Preferred Date:</strong> ${data.date}
          </div>
        </div>

        <p style="color: #475569; line-height: 1.6;">
          <strong>What happens next?</strong><br>
          Our patient coordination team in Namakkal will review your details and call you shortly to confirm your scheduled appointment slot and timing.
        </p>

        <p style="color: #475569; line-height: 1.6;">
          <strong>What should you bring?</strong><br>
          Please bring any prior bone & joint X-rays, MRI scans, previous medical prescriptions, or health records you may have.
        </p>

        <p style="color: #475569; line-height: 1.6; margin-top: 24px;">
          If you need immediate assistance, please call our hospital desk at <strong>${CONFIG.HOSPITAL_PHONE}</strong>.
        </p>
      </div>

      <div style="background-color: #F8FAFC; padding: 14px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0;">
        Dharson Hospital • Namakkal, Tamil Nadu, India
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: patientEmail,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Failed to send patient confirmation email: " + err.toString());
  }
}
