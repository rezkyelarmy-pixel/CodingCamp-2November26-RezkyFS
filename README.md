# My Dashboard

A clean, minimal personal dashboard web app built with plain HTML, CSS, and
vanilla JavaScript. All data is stored in the browser using Local Storage —
no backend required.

## Features

- **Greeting** — Shows the current time, date, and a greeting that changes with
  the time of day (Good morning / afternoon / evening).
- **Focus Timer** — A 25-minute countdown timer with Start, Stop, and Reset
  buttons.
- **To-Do List** — Add, edit, mark as done, and delete tasks. Tasks persist
  across page reloads via Local Storage.
- **Quick Links** — Save your favorite websites as buttons. Click to open in a
  new tab. Links persist via Local Storage.

## Project Structure

```
├── index.html        # Page structure
├── css/
│   └── style.css     # All styling (single CSS file)
└── js/
    └── script.js     # All app logic (single JS file)
```

## How to Run

Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
No build step or server required.

## Deploy with GitHub Pages

1. Push this repository to GitHub.
2. Go to the repo **Settings → Pages**.
3. Under **Source**, select the `main` branch and the `/ (root)` folder.
4. Save. Your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.
