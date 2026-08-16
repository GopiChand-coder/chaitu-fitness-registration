/*
  IMPORTANT:
  After deploying the Google Apps Script backend, paste its Web App URL below.
  Example:
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
*/
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1Q87qRLxuK5nY6mrZleznxIQL1hG8NbnT5r9hkYpnnbyGzS4i2mUKvCFDKInuR059iA/exec";
// Optional library URL (provided):
const GOOGLE_LIBRARY_URL = "https://script.google.com/macros/library/d/1G6zuzD-rfu0PuwZWboeZbmfo6qp3k4-0F2SQMPiJXc6jRkhS6E2Tw-50/2";

const form = document.getElementById("registrationForm");
const sections = [...document.querySelectorAll(".form-section")];
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const sectionLabel = document.getElementById("sectionLabel");
const progressTitle = document.getElementById("progressTitle");
const progressBar = document.getElementById("progressBar");
const success = document.getElementById("success");
const newRegistration = document.getElementById("newRegistration");

let current = 0;

function updateUI() {
  sections.forEach((s, i) => s.classList.toggle("active", i === current));
  const number = String(current + 1).padStart(2, "0");
  sectionLabel.textContent = `${number} / ${String(sections.length).padStart(2, "0")}`;
  progressTitle.textContent = sections[current].dataset.title;
  progressBar.style.width = `${((current + 1) / sections.length) * 100}%`;
  backBtn.disabled = current === 0;
  const last = current === sections.length - 1;
  nextBtn.classList.toggle("hidden", last);
  submitBtn.classList.toggle("hidden", !last);
  window.scrollTo({top: 0, behavior: "smooth"});
}

function setError(field, message) {
  const wrapper = field.closest(".field") || field.closest(".consent") || field.closest(".package");
  if (wrapper) wrapper.classList.add("invalid");
  const error = wrapper?.querySelector(".error");
  if (error) error.textContent = message;
}

function clearErrors(section) {
  section.querySelectorAll(".error").forEach(e => e.textContent = "");
  section.querySelectorAll(".invalid").forEach(e => e.classList.remove("invalid"));
}

function validateSection(section) {
  clearErrors(section);
  let valid = true;

  section.querySelectorAll("[required]").forEach(field => {
    if (field.type === "radio") {
      const group = section.querySelectorAll(`input[name="${field.name}"]`);
      if (![...group].some(r => r.checked)) {
        setError(field, "Please select an option.");
        valid = false;
      }
      return;
    }
    if (field.type === "checkbox") {
      if (!field.checked) {
        setError(field, "Please confirm this.");
        valid = false;
      }
      return;
    }
    if (!field.value.trim()) {
      setError(field, "This field is required.");
      valid = false;
    }
  });

  if (section.dataset.section === "1") {
    ["phone", "whatsapp"].forEach(name => {
      const el = form.elements[name];
      if (el && el.value && !/^\d{10}$/.test(el.value)) {
        setError(el, "Enter a valid 10-digit mobile number.");
        valid = false;
      }
    });
    const email = form.elements.email;
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError(email, "Enter a valid email address.");
      valid = false;
    }
  }

  if (section.dataset.section === "4") {
    const goals = [...section.querySelectorAll('input[name="goals"]:checked')];
    if (!goals.length) {
      document.getElementById("goalError").textContent = "Select at least one fitness goal.";
      valid = false;
    }
  }

  return valid;
}

nextBtn.addEventListener("click", () => {
  if (validateSection(sections[current])) {
    current++;
    updateUI();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateUI();
  }
});

function collectData() {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (key === "goals") {
      data.goals = data.goals ? `${data.goals}, ${value}` : value;
    } else {
      data[key] = value;
    }
  });
  data.submittedAt = new Date().toLocaleString("en-IN", {timeZone:"Asia/Kolkata"});
  return data;
}

async function saveData(data) {
  // Local backup on the device. The Google Sheet is the permanent central storage.
  localStorage.setItem("lastChaituFitnessRegistration", JSON.stringify(data));

  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_GOOGLE")) {
    console.warn("Google Apps Script URL is not configured. Data was only saved locally.");
    return false;
  }

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {"Content-Type": "text/plain;charset=utf-8"},
    body: JSON.stringify(data)
  });
  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateSection(sections[current])) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const data = collectData();
    await saveData(data);
    form.classList.add("hidden");
    document.querySelector(".progress-card").classList.add("hidden");
    success.classList.remove("hidden");
    window.scrollTo({top: 0, behavior: "smooth"});
  } catch (error) {
    console.error(error);
    alert("Something went wrong while submitting. Please check your internet connection and try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Registration ✓";
  }
});

newRegistration.addEventListener("click", () => {
  form.reset();
  current = 0;
  success.classList.add("hidden");
  form.classList.remove("hidden");
  document.querySelector(".progress-card").classList.remove("hidden");
  updateUI();
});

form.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
  });
});

updateUI();
