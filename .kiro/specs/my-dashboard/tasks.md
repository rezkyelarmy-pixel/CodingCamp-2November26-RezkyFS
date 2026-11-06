# Tasks — My Dashboard

## Status legend
- `[ ]` Not started
- `[x]` Completed
- `[-]` In progress

---

## Phase 1 — Core Scaffold

- [x] **TASK-01** Create `index.html` with semantic HTML structure
  - `<header>` for greeting section
  - `<main class="dashboard">` wrapper
  - Three `<section class="card">` elements: timer, todo, links
  - Link to `css/style.css` and `js/script.js`

- [x] **TASK-02** Create `css/style.css` with design tokens and base styles
  - Define all CSS custom properties (`:root`)
  - Reset, body, `.dashboard`, and `.grid` layout rules

---

## Phase 2 — Greeting Feature

- [x] **TASK-03** Implement clock and date display
  - `updateGreeting()` function updating `#current-time` and `#current-date`
  - `setInterval` refresh every 1 000 ms

- [x] **TASK-04** Implement time-of-day greeting phrase
  - `buildGreeting(h)` returns "Good morning / afternoon / evening"

- [x] **TASK-05** Implement custom name chip
  - `renderName()` shows the saved name or a placeholder
  - `activateNameEdit()` replaces the chip with an inline `<input>`
  - Commit on Enter / blur; discard on Escape
  - Persist to `localStorage` key `dashboard.name`

---

## Phase 3 — Focus Timer

- [x] **TASK-06** Implement countdown timer logic
  - `startTimer()`, `stopTimer()`, `resetTimer()`
  - `renderTimer()` formats seconds as `MM:SS`
  - Auto-stop and alert when `timerSeconds` reaches 0

- [x] **TASK-07** Implement custom duration input
  - `applyDuration()` clamps input to 1–120, persists to `localStorage`
  - `durationInput` synced with saved value on page load
  - "Set" button and Enter keydown both call `applyDuration()`

---

## Phase 4 — To-Do List

- [x] **TASK-08** Implement add / render tasks
  - `addTodo(text)`, `renderTodos()`, `saveTodos()`
  - Empty-state hint shown when list is empty

- [x] **TASK-09** Implement toggle done and delete
  - `toggleTodo(index)`, `deleteTodo(index)`
  - Strikethrough style for done items

- [x] **TASK-10** Implement inline edit
  - `editTodo(index, spanEl)` swaps span for `<input>`
  - Commit on Enter / blur; cancel on Escape

- [x] **TASK-11** Implement duplicate prevention
  - `isDuplicate(text)` case-insensitive check
  - `showDuplicateWarn()` displays warning for 3 s

- [x] **TASK-12** Implement sort modes
  - `getSortedView()` returns sorted copy without mutating `todos`
  - Three pill buttons: Default / Active first / Done first
  - Active pill highlighted with accent colour

---

## Phase 5 — Quick Links

- [x] **TASK-13** Implement add / render links
  - `addLink(name, url)`, `renderLinks()`, `saveLinks()`
  - Auto-prepend `https://` if missing
  - Pre-populate three default links on first run

- [x] **TASK-14** Implement delete link
  - `deleteLink(index)` with × button per link
  - `e.stopPropagation()` to prevent the anchor from firing

---

## Phase 6 — Polish & QA

- [x] **TASK-15** Responsive layout
  - Grid collapses to single column at ≤ 600 px
  - Adjust font sizes for small screens

- [x] **TASK-16** Accessibility audit
  - `aria-label` on all icon buttons
  - `aria-live` on timer display and duplicate warning
  - Keyboard navigation tested (Tab, Enter, Space, Escape)

- [ ] **TASK-17** Cross-browser testing
  - Verify in Chrome, Firefox, Edge, Safari

- [ ] **TASK-18** GitHub Pages deployment
  - Push `main` branch, enable Pages in repo Settings
  - Confirm live URL resolves and all features work

---

## Backlog / Future Ideas

- [ ] **IDEA-01** Dark / light theme toggle
- [ ] **IDEA-02** Drag-and-drop reordering of to-do items
- [ ] **IDEA-03** Multiple timer presets (Pomodoro, short break, long break)
- [ ] **IDEA-04** Keyboard shortcut to start/stop timer (e.g. Space)
- [ ] **IDEA-05** Export / import tasks as JSON
- [ ] **IDEA-06** Sound notification when timer ends (optional, user-controlled)
