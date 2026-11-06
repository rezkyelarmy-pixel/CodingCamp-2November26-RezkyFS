/* ============================================================
   My Dashboard - Application Logic
   Features:
   - Greeting (time, date, time-of-day greeting)
   - Custom name in greeting
   - Focus Timer (countdown, changeable duration saved to localStorage)
   - To-Do List (CRUD + Local Storage)
     - Prevent duplicate tasks
     - Sort tasks (default / active-first / done-first)
   - Quick Links (add/remove + Local Storage)
   ============================================================ */

/* ---------- Helpers ---------- */

// Read a JSON value from Local Storage with a safe fallback.
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error("Failed to load", key, err);
    return fallback;
  }
}

// Save a value to Local Storage as JSON.
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Failed to save", key, err);
  }
}

/* ============================================================
   GREETING + CUSTOM NAME
   ============================================================ */

const STORAGE_NAME = "dashboard.name";

const greetingText  = document.getElementById("greeting-text");
const currentTimeEl = document.getElementById("current-time");
const currentDateEl = document.getElementById("current-date");
const nameDisplay   = document.getElementById("name-display");
const nameEditBtn   = document.getElementById("name-edit-btn");

let userName = load(STORAGE_NAME, "");

// Build the greeting line: "Good morning, Rezky" or just "Good morning".
function buildGreeting(h) {
  let phrase;
  if (h < 12)      phrase = "Good morning";
  else if (h < 18) phrase = "Good afternoon";
  else             phrase = "Good evening";
  return phrase;
}

function updateGreeting() {
  const now = new Date();

  // Clock – HH:MM (24-hour).
  const hours   = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  currentTimeEl.textContent = `${hours}:${minutes}`;

  // Date – e.g. "Thursday, 5 November 2026".
  currentDateEl.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Greeting phrase.
  greetingText.textContent = buildGreeting(now.getHours());
}

// Render the name chip (or a placeholder when no name is set).
function renderName() {
  if (userName) {
    nameDisplay.textContent = userName;
    nameDisplay.removeAttribute("aria-label");
    nameDisplay.setAttribute("aria-label", `Your name: ${userName}. Click to edit.`);
  } else {
    nameDisplay.textContent = "Enter your name";
    nameDisplay.style.opacity = "0.45";
  }
  if (userName) nameDisplay.style.opacity = "";
}

// Switch the name chip into an editable input.
function activateNameEdit() {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "name-input";
  input.maxLength = 30;
  input.value = userName;
  input.placeholder = "Your name";
  input.setAttribute("aria-label", "Enter your name");

  // Hide the chip and edit button, show the input instead.
  nameDisplay.style.display = "none";
  nameEditBtn.style.display = "none";
  nameDisplay.parentNode.insertBefore(input, nameEditBtn);

  input.focus();
  input.select();

  const commit = () => {
    const value = input.value.trim();
    if (value !== userName) {
      userName = value;
      save(STORAGE_NAME, userName);
    }
    input.remove();
    nameDisplay.style.display = "";
    nameEditBtn.style.display = "";
    renderName();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") {
      input.value = userName; // discard changes
      commit();
    }
  });
  input.addEventListener("blur", commit);
}

// Clicking the name chip or the pencil icon opens the editor.
nameDisplay.addEventListener("click", activateNameEdit);
nameDisplay.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") activateNameEdit();
});
nameEditBtn.addEventListener("click", activateNameEdit);

updateGreeting();
renderName();
setInterval(updateGreeting, 1000);

/* ============================================================
   FOCUS TIMER
   - Default 25 minutes, user can change duration via input.
   - Custom duration persists in localStorage.
   ============================================================ */

const STORAGE_DURATION = "dashboard.timerDuration";
const DEFAULT_MINUTES  = 25;

// Load saved duration (in minutes), fall back to 25.
let focusMinutes  = load(STORAGE_DURATION, DEFAULT_MINUTES);
let timerSeconds  = focusMinutes * 60;
let timerInterval = null;

const timerDisplay      = document.getElementById("timer-display");
const btnStart          = document.getElementById("timer-start");
const btnStop           = document.getElementById("timer-stop");
const btnReset          = document.getElementById("timer-reset");
const durationInput     = document.getElementById("timer-duration-input");
const btnSet            = document.getElementById("timer-set-btn");

// Sync the input field with the saved value on load.
durationInput.value = focusMinutes;

function renderTimer() {
  const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const secs = String(timerSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${mins}:${secs}`;
}

function startTimer() {
  if (timerInterval) return; // already running

  timerInterval = setInterval(() => {
    timerSeconds--;
    renderTimer();

    if (timerSeconds <= 0) {
      stopTimer();
      timerSeconds = 0;
      renderTimer();
      alert("Time's up! Great focus session. 🎉");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timerSeconds = focusMinutes * 60;
  renderTimer();
}

// Apply the custom duration from the input field.
function applyDuration() {
  const raw = parseInt(durationInput.value, 10);

  // Clamp to a sensible range: 1–120 minutes.
  if (isNaN(raw) || raw < 1) {
    durationInput.value = 1;
    focusMinutes = 1;
  } else if (raw > 120) {
    durationInput.value = 120;
    focusMinutes = 120;
  } else {
    focusMinutes = raw;
  }

  save(STORAGE_DURATION, focusMinutes);

  // Stop any running timer and reset to the new duration.
  stopTimer();
  timerSeconds = focusMinutes * 60;
  renderTimer();
}

btnStart.addEventListener("click", startTimer);
btnStop.addEventListener("click",  stopTimer);
btnReset.addEventListener("click", resetTimer);
btnSet.addEventListener("click",   applyDuration);

// Also apply when the user presses Enter inside the input.
durationInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") applyDuration();
});

renderTimer();

/* ============================================================
   TO-DO LIST
   Features: add, edit, toggle done, delete, persist to localStorage.
   NEW: prevent duplicate tasks, sort (default / active-first / done-first).
   ============================================================ */

const STORAGE_TODOS = "dashboard.todos";
let todos     = load(STORAGE_TODOS, []);
let sortOrder = "default"; // "default" | "active" | "done"

const todoForm          = document.getElementById("todo-form");
const todoInput         = document.getElementById("todo-input");
const todoListEl        = document.getElementById("todo-list");
const todoEmpty         = document.getElementById("todo-empty");
const todoDuplicateWarn = document.getElementById("todo-duplicate-warn");

// --- Sort helpers ---

// Returns a view (copy) of todos sorted by the current sortOrder.
// The original `todos` array order (used as the "default / add order") is preserved.
function getSortedView() {
  const indexed = todos.map((t, i) => ({ ...t, _orig: i }));
  if (sortOrder === "active") {
    return indexed.sort((a, b) => Number(a.done) - Number(b.done));
  }
  if (sortOrder === "done") {
    return indexed.sort((a, b) => Number(b.done) - Number(a.done));
  }
  return indexed; // default: keep insertion order
}

// --- Sort button wiring ---
const sortButtons = document.querySelectorAll(".sort-btn");
sortButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sortOrder = btn.dataset.sort;
    sortButtons.forEach((b) => {
      const isActive = b.dataset.sort === sortOrder;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });
    renderTodos();
  });
});

// --- Render ---

function saveTodos() {
  save(STORAGE_TODOS, todos);
}

function renderTodos() {
  todoListEl.innerHTML = "";
  todoEmpty.style.display = todos.length === 0 ? "block" : "none";

  const view = getSortedView();

  view.forEach((todo) => {
    // `_orig` is the real index in the source `todos` array.
    const origIndex = todo._orig;

    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    // Checkbox to toggle completion.
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", "Mark task as done");
    checkbox.addEventListener("change", () => toggleTodo(origIndex));

    // Task text.
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    // Action buttons: edit & delete.
    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.type = "button";
    editBtn.title = "Edit";
    editBtn.textContent = "✎";
    editBtn.addEventListener("click", () => editTodo(origIndex, span));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn danger";
    deleteBtn.type = "button";
    deleteBtn.title = "Delete";
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => deleteTodo(origIndex));

    actions.append(editBtn, deleteBtn);
    li.append(checkbox, span, actions);
    todoListEl.appendChild(li);
  });
}

// --- Duplicate check ---

// Returns true if an identical task text (case-insensitive) already exists.
function isDuplicate(text) {
  return todos.some(
    (t) => t.text.trim().toLowerCase() === text.trim().toLowerCase()
  );
}

let warnTimeout = null;

function showDuplicateWarn() {
  todoDuplicateWarn.hidden = false;
  clearTimeout(warnTimeout);
  warnTimeout = setTimeout(() => {
    todoDuplicateWarn.hidden = true;
  }, 3000); // auto-hide after 3 s
}

// --- CRUD ---

function addTodo(text) {
  todos.push({ text, done: false });
  saveTodos();
  renderTodos();
}

function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  saveTodos();
  renderTodos();
}

function editTodo(index, spanEl) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "todo-edit";
  input.value = todos[index].text;
  input.setAttribute("aria-label", "Edit task");

  spanEl.replaceWith(input);
  input.focus();
  input.select();

  const commit = () => {
    const value = input.value.trim();
    if (value && value !== todos[index].text) {
      // Check for duplicate only when the text actually changed.
      if (isDuplicate(value) && value.toLowerCase() !== todos[index].text.toLowerCase()) {
        showDuplicateWarn();
        // Revert to original text and stop editing.
        renderTodos();
        return;
      }
      todos[index].text = value;
      saveTodos();
    }
    renderTodos();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") renderTodos();
  });
  input.addEventListener("blur", commit);
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = todoInput.value.trim();
  if (!value) return;

  // Prevent duplicate tasks.
  if (isDuplicate(value)) {
    showDuplicateWarn();
    todoInput.select();
    return;
  }

  todoDuplicateWarn.hidden = true; // clear any previous warning
  addTodo(value);
  todoInput.value = "";
});

renderTodos();

/* ============================================================
   QUICK LINKS
   ============================================================ */

const STORAGE_LINKS = "dashboard.links";
let links = load(STORAGE_LINKS, []);

const linkForm      = document.getElementById("link-form");
const linkNameInput = document.getElementById("link-name");
const linkUrlInput  = document.getElementById("link-url");
const linksListEl   = document.getElementById("links-list");
const linksEmpty    = document.getElementById("links-empty");

// Sensible defaults on first run.
const DEFAULT_LINKS = [
  { name: "Google",  url: "https://google.com" },
  { name: "GitHub",  url: "https://github.com" },
  { name: "YouTube", url: "https://youtube.com" },
];

if (links.length === 0 && !localStorage.getItem(STORAGE_LINKS)) {
  links = [...DEFAULT_LINKS];
  save(STORAGE_LINKS, links);
}

function saveLinks() {
  save(STORAGE_LINKS, links);
}

function renderLinks() {
  linksListEl.innerHTML = "";
  linksEmpty.style.display = links.length === 0 ? "block" : "none";

  links.forEach((link, index) => {
    const a = document.createElement("a");
    a.className = "link-item";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = link.name;

    const removeBtn = document.createElement("button");
    removeBtn.className = "link-remove";
    removeBtn.type = "button";
    removeBtn.title = "Remove link";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteLink(index);
    });

    a.appendChild(removeBtn);
    linksListEl.appendChild(a);
  });
}

function addLink(name, url) {
  links.push({ name, url });
  saveLinks();
  renderLinks();
}

function deleteLink(index) {
  links.splice(index, 1);
  saveLinks();
  renderLinks();
}

linkForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = linkNameInput.value.trim();
  let url    = linkUrlInput.value.trim();

  if (!name || !url) return;

  // Ensure protocol so the link opens correctly.
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  addLink(name, url);
  linkNameInput.value = "";
  linkUrlInput.value  = "";
});

renderLinks();
