# Google Apps Script Lead Webhook Setup

This guide details how to deploy a serverless, zero-maintenance webhook receiver using **Google Apps Script** that appends incoming leads from the **Practo for Animals** platform into a Google Sheet in real time.

---

## 1. Create Your Target Google Sheet

1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name the spreadsheet (e.g. `Practo for Animals — Lead Pipeline`).
3. *(Optional)* Rename the default sheet tab to `Practo Leads`, or leave it as `Sheet1`. The script will automatically create a tab named `Practo Leads` if it doesn't already exist.

---

## 2. Add the Webhook Script

1. In your Google Sheet menu bar, click **Extensions** → **Apps Script**.
2. An Apps Script editor tab will open.
3. Delete any default code in `Code.gs`.
4. Copy the entire contents of [`google-apps-script/Code.gs`](../google-apps-script/Code.gs) from this repository and paste it into the editor.
5. Click the **Save** icon (floppy disk) or press `Ctrl + S` (`Cmd + S` on Mac).

---

## 3. Deploy as a Web Application

1. At the top right of the Apps Script editor, click **Deploy** → **New deployment**.
2. Click the gear icon (**Select type**) next to "Select type" and choose **Web app**.
3. In the configuration dialog, configure the following settings:
   - **Description**: `Practo Leads Ingestion Webhook v1`
   - **Execute as**: **Me** (`your-email@gmail.com`)
   - **Who has access**: **Anyone** *(Essential: allows your frontend client to submit leads without requiring Google sign-in)*
4. Click **Deploy**.
5. If prompted, click **Authorize access**, select your Google account, click **Advanced**, and then click **Go to Untitled project (unsafe)** to grant permissions to write to your Sheet.
6. Copy the **Web App URL** provided (it ends with `/exec`):
   ```text
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

## 4. Configure Your Frontend Environment

1. In the project root of `Practo`, create or edit your local `.env` file (do not commit this file):
   ```bash
   VITE_LEAD_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbx.../exec
   VITE_WHATSAPP_INVITE_URL=https://chat.whatsapp.com/demo-invite-token
   ```
2. Restart your local development server:
   ```bash
   npm run dev
   ```

---

## 5. Verification & Testing

1. Navigate to `/learn` in your browser.
2. Click **Reserve Your Seat**.
3. Fill out Step 1 and Step 2 and click **Complete Reservation**.
4. Check your Google Sheet:
   - A new tab named `Practo Leads` will appear.
   - The first row will be automatically created with bold, brand-teal headers.
   - Your lead data will appear in the next row with timestamp, contact info, batch, and captured UTM parameters.
5. Test anti-spam honeypot: Any payload with a non-empty `company` field will return `{ "ok": true }` to the bot but will be silently dropped without appending to the Sheet.

---

## 6. Optional: Enable Email Confirmations

To send an automated email acknowledgement to learners using Google's free daily quota:
1. Open the script in **Extensions** → **Apps Script**.
2. Change line 13:
   ```javascript
   ENABLE_EMAIL_CONFIRMATION: true,
   ```
3. Click **Deploy** → **Manage deployments** → edit active deployment → choose **New version** → click **Deploy**.
