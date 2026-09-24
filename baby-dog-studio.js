/**
 * Mazda 2 Rally registration form.
 *
 * Email delivery: sign up at https://formspree.io (free tier), create a form
 * that sends to gertiegeyer@gmail.com, then paste your form endpoint below.
 * Example: "https://formspree.io/f/abcdefgh"
 */
const RALLY_FORM_ENDPOINT = "https://formspree.io/f/xljdeqdd";
const MAZDA_EXPLOSION_SRC = "assets/mazda-etch-explosion.png";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setYear() {
  document.querySelectorAll("#year").forEach((el) => {
    el.textContent = new Date().getFullYear().toString();
  });
}

function clearFieldErrors(form) {
  form.querySelectorAll(".bds-form__field--invalid").forEach((el) => {
    el.classList.remove("bds-form__field--invalid");
  });
  form.querySelectorAll(".bds-form__error").forEach((el) => {
    el.textContent = "";
  });
  form.querySelectorAll("[aria-invalid]").forEach((el) => {
    el.removeAttribute("aria-invalid");
  });
  form.querySelectorAll(".bds-form__fieldset--invalid").forEach((el) => {
    el.classList.remove("bds-form__fieldset--invalid");
  });
}

function setFieldError(form, fieldId, message) {
  const input = form.querySelector(`#${fieldId}`);
  if (!input) return;
  const field = input.closest(".bds-form__field") || input.closest(".bds-form__fieldset");
  const errorEl = form.querySelector(`#${fieldId}-error`);
  if (field) field.classList.add(field.classList.contains("bds-form__fieldset") ? "bds-form__fieldset--invalid" : "bds-form__field--invalid");
  if (errorEl) errorEl.textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function validateForm(form) {
  clearFieldErrors(form);
  let valid = true;

  const name = form.querySelector("#rally-name");
  if (!name.value.trim()) {
    setFieldError(form, "rally-name", "Please enter your name.");
    valid = false;
  }

  const email = form.querySelector("#rally-email");
  if (!email.value.trim()) {
    setFieldError(form, "rally-email", "Please enter your email address.");
    valid = false;
  } else if (!EMAIL_PATTERN.test(email.value.trim())) {
    setFieldError(form, "rally-email", "Please enter a valid email address.");
    valid = false;
  }

  const suburb = form.querySelector("#rally-suburb");
  if (!suburb.value.trim()) {
    setFieldError(form, "rally-suburb", "Please enter your suburb.");
    valid = false;
  }

  const year = form.querySelector("#rally-year");
  if (!year.value.trim()) {
    setFieldError(form, "rally-year", "Please enter your Mazda 2 year.");
    valid = false;
  }

  const colour = form.querySelector("#rally-colour");
  if (!colour.value.trim()) {
    setFieldError(form, "rally-colour", "Please enter your Mazda 2 colour.");
    valid = false;
  }

  const shirt = form.querySelector("#rally-shirt");
  if (!shirt.value) {
    setFieldError(form, "rally-shirt", "Please choose a T-shirt size.");
    valid = false;
  }

  const attendance = form.querySelector('input[name="attendance"]:checked');
  const fieldset = form.querySelector(".bds-form__fieldset");
  if (!attendance) {
    const errorEl = form.querySelector("#rally-attendance-error");
    if (fieldset) fieldset.classList.add("bds-form__fieldset--invalid");
    if (errorEl) {
      errorEl.textContent = "Please choose an option.";
    }
    valid = false;
  }

  const consent = form.querySelector("#rally-consent");
  if (!consent.checked) {
    setFieldError(form, "rally-consent", "Please confirm you're happy to be contacted by email.");
    valid = false;
  }

  return valid;
}

function formDataToPayload(form) {
  const data = new FormData(form);
  return {
    _subject: "Mazda 2 Rally — new registration",
    _replyto: data.get("email"),
    name: data.get("name"),
    email: data.get("email"),
    suburb: data.get("suburb"),
    mazda_year: data.get("mazda_year"),
    mazda_colour: data.get("mazda_colour"),
    kilometres: data.get("kilometres") || "(not provided)",
    owned_duration: data.get("owned_duration") || "(not provided)",
    mazda_story: data.get("mazda_story") || "(not provided)",
    mazda_name: data.get("mazda_name") || "(not provided)",
    tshirt_size: data.get("tshirt_size"),
    attendance: data.get("attendance"),
    email_consent: data.get("email_consent") ? "yes" : "no",
  };
}

async function submitRallyForm(form) {
  const statusEl = document.getElementById("rally-form-status");
  const submitBtn = document.getElementById("rally-submit");
  const honeypot = form.querySelector("#rally-website");

  if (honeypot && honeypot.value.trim()) {
    showSuccess(form, statusEl);
    return;
  }

  if (!RALLY_FORM_ENDPOINT) {
    if (statusEl) {
      statusEl.textContent =
        "Form email is not set up yet. Add your Formspree endpoint in baby-dog-studio.js (see FORMS-SETUP.md).";
      statusEl.classList.add("bds-form__status--error");
    }
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  if (statusEl) {
    statusEl.textContent = "";
    statusEl.classList.remove("bds-form__status--error");
  }

  try {
    const response = await fetch(RALLY_FORM_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataToPayload(form)),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message =
        body.error ||
        "Something went wrong sending your registration. Please try again or email gertiegeyer@gmail.com.";
      throw new Error(message);
    }

    showSuccess(form, statusEl);
  } catch (err) {
    if (statusEl) {
      statusEl.textContent =
        err.message ||
        "Something went wrong. Please try again or email gertiegeyer@gmail.com.";
      statusEl.classList.add("bds-form__status--error");
    }
    submitBtn.disabled = false;
    submitBtn.textContent = "Add my Mazda";
  }
}

function showSuccess(form, statusEl) {
  form.hidden = true;
  const header = document.querySelector(".bds-form__header");
  if (header) header.hidden = true;
  const privacy = document.querySelector(".bds-form__privacy");
  if (privacy) privacy.hidden = true;
  const success = document.getElementById("rally-success");
  if (success) success.hidden = false;
  if (statusEl) {
    statusEl.textContent = "";
    statusEl.classList.remove("bds-form__status--error");
  }
  if (success) {
    success.focus({ preventScroll: false });
  }
}

function initRallyForm() {
  const form = document.getElementById("rally-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm(form)) {
      const firstInvalid = form.querySelector(
        ".bds-form__field--invalid input, .bds-form__field--invalid select, .bds-form__fieldset--invalid input"
      );
      firstInvalid?.focus();
      return;
    }
    submitRallyForm(form);
  });

  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", () => {
      el.removeAttribute("aria-invalid");
      const field = el.closest(".bds-form__field") || el.closest(".bds-form__fieldset");
      field?.classList.remove("bds-form__field--invalid", "bds-form__fieldset--invalid");
    });
  });
}

function spawnMazdaDrive(x, y) {
  document.querySelectorAll(".bds-drive__car").forEach((el) => el.remove());

  const img = document.createElement("img");
  img.src = MAZDA_EXPLOSION_SRC;
  img.alt = "";
  img.className = "bds-drive__car";
  img.setAttribute("aria-hidden", "true");

  const goRight = x < window.innerWidth / 2;
  const startX = goRight ? -120 : window.innerWidth + 120;
  const endX = goRight ? window.innerWidth + 120 : -120;
  const driveY = Math.min(Math.max(y, 80), window.innerHeight - 80);

  img.style.setProperty("--bds-drive-y", `${driveY}px`);
  img.style.setProperty("--bds-drive-start", `${startX}px`);
  img.style.setProperty("--bds-drive-end", `${endX}px`);
  if (!goRight) {
    img.classList.add("bds-drive__car--left");
  }

  img.addEventListener("animationend", () => img.remove());
  document.body.appendChild(img);
}

function initMazdaDrive() {
  const main = document.querySelector(".bds");
  if (!main) return;

  main.addEventListener("click", (event) => {
    const button = event.target.closest("button, .bds-btn");
    if (!button || !main.contains(button)) return;
    spawnMazdaDrive(event.clientX, event.clientY);
  });
}

setYear();
initRallyForm();
initMazdaDrive();
