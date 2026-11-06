# Project Steering — My Dashboard

## Stack

- **HTML5** — semantic markup, no templates
- **CSS3** — single file (`css/style.css`), custom properties for theming
- **Vanilla JavaScript** — single file (`js/script.js`), no frameworks, no modules
- **localStorage** — only persistence layer; no backend, no network calls

## Conventions

- Keep all styles in `css/style.css`. No inline styles.
- Keep all logic in `js/script.js`. No `<script>` blocks in HTML.
- Use CSS custom properties (`--var`) for all colours, sizes, and shadows.
- Prefer `const` / `let`; never use `var`.
- All interactive elements must have an `aria-label` or visible `<label>`.
- Use `load(key, fallback)` and `save(key, value)` helpers for all localStorage access.

## localStorage Keys

| Key                      | Type                                    |
|--------------------------|-----------------------------------------|
| `dashboard.name`         | `string`                                |
| `dashboard.timerDuration`| `number` (minutes)                      |
| `dashboard.todos`        | `Array<{ text: string, done: boolean }>`|
| `dashboard.links`        | `Array<{ name: string, url: string }>`  |

## File Structure

```
index.html
css/style.css
js/script.js
.kiro/specs/my-dashboard/
  .config.kiro
  requirements.md
  design.md
  tasks.md
.kiro/steering/
  project.md
```

## Do Not

- Do not add npm, bundlers, or any build step.
- Do not introduce external CSS frameworks (Bootstrap, Tailwind, etc.).
- Do not use ES modules (`import`/`export`) — the script runs as a classic script.
- Do not make fetch/XHR calls at runtime.
