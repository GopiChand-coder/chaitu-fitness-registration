/*
  CHAITU FITNESS - Google Apps Script backend
  1. Open your Google Sheet.
  2. Make sure a tab named "chaitu" (or "Chaitu") exists.
  3. Extensions -> Apps Script.
  4. Replace all contents of Code.gs with this code.
  5. Click Deploy -> New deployment -> Web app.
  6. Execute as: Me
  7. Who has access: Anyone
  8. Click Deploy (or New Version if updating) and copy the Web app URL.
  9. Paste the Web app URL in script.js.
*/

const TARGET_SHEET_NAME = "chaitu";

function getTargetSheet(ss) {
  const sheets = ss.getSheets();

  // 1. Look for an existing sheet tab named "chaitu" or "Chaitu" (case-insensitive)
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim().toLowerCase() === TARGET_SHEET_NAME.toLowerCase()) {
      return sheets[i];
    }
  }

  // 2. If no "chaitu" tab exists, check if default "Sheet1" exists and rename it to "chaitu"
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim() === "Sheet1") {
      sheets[i].setName("chaitu");
      return sheets[i];
    }
  }

  // 3. Otherwise, create a new tab named "chaitu"
  return ss.insertSheet("chaitu");
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: "Chaitu Fitness Apps Script Backend is working!",
      targetSheet: TARGET_SHEET_NAME,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    let data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    console.log("Incoming registration payload:", data);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error("No active spreadsheet found. Make sure Apps Script was opened via Extensions -> Apps Script inside your Google Sheet.");
    }

    let sheet = getTargetSheet(ss);

    // Ensure header row exists
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1, 1, 1).getValue() === "") {
      sheet.appendRow([
        "Submitted At", "Full Name", "Age", "Gender", "Phone", "City",
        "Height (cm)", "Weight (kg)", "Target Weight (kg)",
        "Experience Level", "Previous Gym", "Gym Experience",
        "Activity Level", "Fitness Goals", "Other Goal", "Diet", "Profession",
        "Sleep Hours", "Water Litres", "Daily Routine", "Package", "Notes", "Consent"
      ]);
      sheet.setFrozenRows(1);
      try {
        const headerRange = sheet.getRange(1, 1, 1, 23);
        headerRange.setFontWeight("bold");
        headerRange.setBackground("#f3f4f6");
      } catch (styleErr) {
        // Ignore header styling errors if any
      }
    }

    const row = [
      data.submittedAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.fullName || "",
      data.age || "",
      data.gender || "",
      data.phone || "",
      data.city || "",
      data.height || "",
      data.weight || "",
      data.targetWeight || "",
      data.experienceLevel || "",
      data.previousGym || "",
      data.gymExperience || "",
      data.activityLevel || "",
      data.goals || "",
      data.otherGoal || "",
      data.diet || "",
      data.profession || "",
      data.sleep || "",
      data.water || "",
      data.routine || "",
      data.package || "",
      data.notes || "",
      data.consent ? "Yes" : "No"
    ];

    sheet.appendRow(row);
    console.log("Row appended successfully to sheet '" + sheet.getName() + "':", row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, sheetName: sheet.getName() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("Failed to save registration:", String(err));
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
