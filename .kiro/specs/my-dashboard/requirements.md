# Requirements — My Dashboard

## Overview

My Dashboard is a lightweight, browser-only personal productivity page.
It requires no build step, no backend, and no external dependencies.
All persistent state is stored in `localStorage`.

---

## Functional Requirements

### 1. Greeting Section
- **FR-1.1** Display a dynamic greeting phrase that changes based on time of day:
  - 00:00–11:59 → "Good morning"
  - 12:00–17:59 → "Good afternoon"
  - 18:00–23:59 → "Good evening"
- **FR-1.2** Display the current time in `HH:MM` (24-hour) format, updated every second.
- **FR-1.3** Display the current date in long format (e.g. "Thursday, 5 November 2026").
- **FR-1.4** Allow the user to set a custom name that appears below the greeting phrase.
  - Name persists in `localStorage` under key `dashboard.name`.
  - Clicking the name chip or the edit icon (✎) opens an inline text input.
  - Pressing **Enter** or clicking away commits the change; **Escape** discards it.

### 2. Focus Timer
- **FR-2.1** Display a countdown timer, defaulting to 25 minutes (Pomodoro-style).
- **FR-2.2** Provide **Start**, **Stop**, and **Reset** buttons.
- **FR-2.3** Allow the user to set a custom duration (1–120 minutes) via a number input and a **Set** button.
  - Custom duration persists in `localStorage` under key `dashboard.timerDuration`.
- **FR-2.4** When the timer reaches 00:00, stop automatically and show an alert congratulating the user.

### 3. To-Do List
- **FR-3.1** Allow the user to add tasks via a text input form.
- **FR-3.2** Prevent duplicate tasks (case-insensitive comparison); show a warning for 3 seconds if a duplicate is entered.
- **FR-3.3** Each task has a checkbox to toggle completion (struck-through style when done).
- **FR-3.4** Each task has an edit button (✎) that replaces the text with an inline input.
- **FR-3.5** Each task has a delete button (🗑) to remove it immediately.
- **FR-3.6** Provide three sort modes (pill buttons): **Default** (insertion order), **Active first**, **Done first**.
- **FR-3.7** Tasks persist in `localStorage` under key `dashboard.todos`.

### 4. Quick Links
- **FR-4.1** Allow the user to add bookmarks with a name and a URL.
  - Automatically prepend `https://` if no protocol is provided.
- **FR-4.2** Each link opens in a new tab with `rel="noopener noreferrer"`.
- **FR-4.3** Each link has a remove button (×) to delete it.
- **FR-4.4** Pre-populate with three default links (Google, GitHub, YouTube) on first run.
- **FR-4.5** Links persist in `localStorage` under key `dashboard.links`.

---

## Non-Functional Requirements

- **NFR-1** No frameworks, no build tools — plain HTML + CSS + vanilla JS only.
- **NFR-2** All features must work in the latest versions of Chrome, Firefox, Edge, and Safari.
- **NFR-3** The page must be fully usable at viewport widths ≥ 320 px.
- **NFR-4** Interactive elements must be keyboard-accessible and carry appropriate ARIA attributes.
- **NFR-5** No network requests are made at runtime; the app works fully offline after the initial page load.
- **NFR-6** Deployable as a static site on GitHub Pages without modification.
