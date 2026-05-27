const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const termsInput = document.getElementById('terms');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const charCount = document.getElementById('charCount');
const toast = document.getElementById('toast');
const formStatus = document.getElementById('formStatus');
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const themeIcon = document.getElementById('themeIcon');

const nameField = document.getElementById('nameField');
const emailField = document.getElementById('emailField');
const messageField = document.getElementById('messageField');

const previewName = document.getElementById('previewName');
const previewEmail = document.getElementById('previewEmail');
const previewMessage = document.getElementById('previewMessage');

const MAX_MESSAGE = 300;
let savedDraft = { name: '', email: '', message: '' };
let currentTheme = 'light';

const touched = {
    name: false,
    email: false,
    message: false
};

function setTheme(theme) {
    currentTheme = theme;
    document.body.classList.toggle('dark', theme === 'dark');
    themeText.textContent = theme === 'dark' ? 'Light' : 'Dark';
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function detectPreferredTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
}

function showError(fieldElement, shouldShow) {
    fieldElement.classList.toggle('error', shouldShow);
}

function isNameValid() {
    return nameInput.value.trim().length > 1;
}

function isEmailValid() {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(emailInput.value.trim());
}

function isMessageValid() {
    if (messageInput.value.length > MAX_MESSAGE) {
        messageInput.value = messageInput.value.slice(0, MAX_MESSAGE);
    }

    const length = messageInput.value.trim().length;
    charCount.textContent = `${length} / ${MAX_MESSAGE}`;
    return length >= 10;
}

function validateField(fieldName, forceShow = false) {
    let valid = false;

    if (fieldName === 'name') {
        valid = isNameValid();
        showError(nameField, !valid && (touched.name || forceShow));
    }

    if (fieldName === 'email') {
        valid = isEmailValid();
        showError(emailField, !valid && (touched.email || forceShow));
    }

    if (fieldName === 'message') {
        valid = isMessageValid();
        showError(messageField, !valid && (touched.message || forceShow));
    }

    return valid;
}

function updateProgress() {
    let completed = 0;

    if (nameInput.value.trim()) completed += 1;
    if (emailInput.value.trim()) completed += 1;
    if (messageInput.value.trim()) completed += 1;
    if (termsInput.checked) completed += 1;

    const percent = Math.round((completed / 4) * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
}

function updateStatus() {
    const nameValid = isNameValid();
    const emailValid = isEmailValid();
    const messageValid = isMessageValid();
    const allValid = nameValid && emailValid && messageValid && termsInput.checked;

    submitBtn.disabled = !allValid;
    formStatus.textContent = allValid ? 'Ready to submit' : 'Fill all fields';
}

function saveDraft() {
    savedDraft = {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
    };
}

function loadDraft() {
    nameInput.value = savedDraft.name;
    emailInput.value = savedDraft.email;
    messageInput.value = savedDraft.message;
    charCount.textContent = `${messageInput.value.trim().length} / ${MAX_MESSAGE}`;
}

function clearForm() {
    form.reset();
    savedDraft = { name: '', email: '', message: '' };

    touched.name = false;
    touched.email = false;
    touched.message = false;

    [nameField, emailField, messageField].forEach(field => field.classList.remove('error'));

    charCount.textContent = `0 / ${MAX_MESSAGE}`;
    updateProgress();
    updateStatus();
    formStatus.textContent = 'Cleared';
}

function updatePreview(data) {
    previewName.textContent = data.name || '—';
    previewEmail.textContent = data.email || '—';
    previewMessage.textContent = data.message || 'No submission yet.';
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2600);
}

nameInput.addEventListener('input', () => {
    saveDraft();
    updateProgress();
    updateStatus();
    if (touched.name) validateField('name');
});

emailInput.addEventListener('input', () => {
    saveDraft();
    updateProgress();
    updateStatus();
    if (touched.email) validateField('email');
});

messageInput.addEventListener('input', () => {
    saveDraft();
    updateProgress();
    updateStatus();
    isMessageValid();
    if (touched.message) validateField('message');
});

nameInput.addEventListener('blur', () => {
    touched.name = true;
    validateField('name');
    updateStatus();
});

emailInput.addEventListener('blur', () => {
    touched.email = true;
    validateField('email');
    updateStatus();
});

messageInput.addEventListener('blur', () => {
    touched.message = true;
    validateField('message');
    updateStatus();
});

termsInput.addEventListener('change', () => {
    updateProgress();
    updateStatus();
});

clearBtn.addEventListener('click', clearForm);

themeToggle.addEventListener('click', () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    touched.name = true;
    touched.email = true;
    touched.message = true;

    const nameValid = validateField('name', true);
    const emailValid = validateField('email', true);
    const messageValid = validateField('message', true);

    if (!nameValid || !emailValid || !messageValid || !termsInput.checked) {
        updateStatus();
        return;
    }

    submitBtn.disabled = true;
    formStatus.textContent = 'Submitting...';
    submitBtn.textContent = 'Sending...';

    const submittedData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
    };

    setTimeout(() => {
        updatePreview(submittedData);
        form.reset();
        savedDraft = { name: '', email: '', message: '' };

        touched.name = false;
        touched.email = false;
        touched.message = false;

        [nameField, emailField, messageField].forEach(field => field.classList.remove('error'));

        submitBtn.textContent = 'Submit form';
        charCount.textContent = `0 / ${MAX_MESSAGE}`;
        updateProgress();
        updateStatus();
        formStatus.textContent = 'Submitted';
        showToast();
    }, 1000);
});

detectPreferredTheme();
loadDraft();
updatePreview({});
updateProgress();
updateStatus();