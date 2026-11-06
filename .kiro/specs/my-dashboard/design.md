# Design — My Dashboard

## Architecture

The app is intentionally dependency-free: a single HTML file, one CSS file,
and one JavaScript file.

```
index.html          ← Page structure & semantic markup
css/
  style.css         ← All visual design (custom properties, layout, components)
js/
  script.js         ← All application logic (no modules, runs in global scope)
```

Data flow is simple: JavaScript reads/writes `localStorage` directly;
there is no state manager or reactive framework.

---

## Visual Design

### Design Tokens (CSS custom properties)

| Token          | Value       | Purpose                       |
|----------------|-------------|-------------------------------|
| `--bg`         | `#0f172a`   | Page background (deep navy)   |
| `--surface`    | `#1e293b`   | Card background               |
| `--surface-2`  | `#334155`   | Hover / secondary surface     |
| `--text`       | `#f1f5f9`   | Primary text                  |
| `--muted`      | `#94a3b8`   | Secondary / placeholder text  |
| `--accent`     | `#6366f1`   | Primary interactive colour    |
| `--accent-hover`| `#4f46e5`  | Accent on hover               |
| `--success`    | `#22c55e`   | Checkbox accent               |
| `--danger`     | `#ef4444`   | Destructive actions           |
| `--border`     | `#475569`   | Input and card borders        |
| `--radius`     | `12px`      | Card corner radius            |
| `--shadow`     | `0 8px 24px rgba(0,0,0,.25)` | Card drop-shadow |

### Layout

```
┌─────────────────────────────────────────────────┐
│                  Greeting Header                │
│   (greeting phrase · name chip · time · date)  │
├────────────┬────────────┬────────────────────────┤
│ Focus Timer│  To-Do List│     Quick Links        │
│  card       │    card    │       card             │
└────────────┴────────────┴────────────────────────┘
```

- `.dashboard` centres content with `max-width: 960px`.
- `.grid` uses `auto-fit` CSS Grid so cards wrap to one column on small screens.

---

## Component Breakdown

### Greeting (`<header class="greeting">`)
- `#greeting-text` — phrase updated via `setInterval` every second.
- `#name-display` — `<span role="button">` that opens an inline `<input>` on click/Enter.
- `#name-edit-btn` — pencil icon (✎) that triggers the same editor.
- `#current-time` — `HH:MM` clock.
- `#current-date` — long locale date string.

### Focus Timer (`<section class="card timer-card">`)
- `#timer-display` — large `HH:MM` countdown with `aria-live="polite"`.
- `#timer-start` / `#timer-stop` / `#timer-reset` — control buttons.
- `#timer-duration-input` — number input (1–120), uses `setInterval` for live countdown.
- `#timer-set-btn` — applies the custom duration, resets the running timer.

### To-Do List (`<section class="card todo-card">`)
- `#todo-form` — add-task form.
- `#todo-duplicate-warn` — `aria-live` warning paragraph, auto-hidden after 3 s.
- `.sort-btn[data-sort]` — three sort-mode pills.
- `#todo-list` — dynamic `<ul>` rebuilt on every state change.
- Each `<li>` contains: checkbox · text span · edit button · delete button.

### Quick Links (`<section class="card links-card">`)
- `#link-form` — add-link form (name + URL inputs).
- `#links-list` — dynamic container of `<a>` elements.
- Each `<a>` has an inline remove button (×).

---

## State & Persistence

| Feature       | localStorage key           | Shape                                  |
|---------------|----------------------------|----------------------------------------|
| Name          | `dashboard.name`           | `string`                               |
| Timer duration| `dashboard.timerDuration`  | `number` (minutes, 1–120)              |
| To-dos        | `dashboard.todos`          | `Array<{ text: string, done: boolean }>`|
| Quick links   | `dashboard.links`          | `Array<{ name: string, url: string }>` |

All reads/writes go through `load(key, fallback)` and `save(key, value)` helpers
that wrap `JSON.parse` / `JSON.stringify` in a try/catch.

---

## Accessibility

- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<form>`, `<ul>`).
- Every interactive control has an `aria-label` or visible label.
- `aria-live="polite"` on the timer display and the duplicate-task warning.
- All buttons and the name chip are keyboard-focusable (Enter/Space activate).
- Colour contrast ratios meet WCAG AA for body text on card backgrounds.
