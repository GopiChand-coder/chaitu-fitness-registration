# Chaitu Fitness - Client Registration System

A mobile-friendly client registration web application for **Chaitu Fitness**. Built for sharing in an Instagram bio, it collects client details, body measurements, fitness goals, and package selection, automatically saving all responses to a Google Sheet.

---

## 🚀 Key Features

- **Mobile-First Design**: Smooth multi-step registration form optimized for smartphones.
- **Google Sheets Integration**: Automatically saves client submissions to a Google Sheet tab named `chaitu`.
- **Local Storage Backup**: Keeps a local backup on the device to prevent data loss.
- **Custom Goal & Package Selection**: Collects goals, workout history, diet choices, and selected plans.

---

## 📁 Project Files

- **`index.html`**: Form structure and content layout.
- **`style.css`**: Premium dark-mode styling and modern UI theme.
- **`script.js`**: Interactive step navigation, validation, and API submission.
- **`Code.gs`**: Google Apps Script code to bind the form with Google Sheets.

---

## ⚡ Quick Deployment Setup

1. **Google Sheet Backend**:
   - Open your Google Sheet and name a tab `chaitu`.
   - Go to **Extensions → Apps Script**, paste the contents of `Code.gs`.
   - Deploy as a **Web App** (Execute as: *Me*, Who has access: *Anyone*).
   - Copy the Web App URL into `script.js`.

2. **Frontend Hosting**:
   - Upload the project files to **GitHub Pages**, **Netlify**, or **Vercel**.
   - Share your live site link or short link in your Instagram bio!
