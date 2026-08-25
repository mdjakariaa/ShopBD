# FOREVER Admin Panel — React + Tailwind

Pixel-focused recreation of the supplied `Web.png` and `Responsive.png` references.

## Stack

- React.js
- Vite
- Tailwind CSS
- React Router DOM

## Pages

- `/add` — Add Items
- `/list` — List Items
- `/orders` — Orders

The workspace area is intentionally empty on all three routes. Only the active sidebar item changes.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Responsive behavior

- Sidebar is `18%` wide, matching the proportions in the supplied references.
- At widths below Tailwind's `md` breakpoint (768px), menu text is hidden while the icons remain visible.
- The sidebar never becomes a drawer or hamburger menu.

## Asset note

The supplied ZIP was inspected first. Its `add_icon.png` and `order_icon.png` are used directly.

The supplied ZIP's `logo.png` contains a different **SHOPBD** logo and therefore does not correspond to the supplied FOREVER reference screenshots. To keep the screenshots as the visual source of truth, `forever_admin_logo.png` was prepared directly from the supplied desktop reference image. The original mismatched file is preserved as `src/assets/provided_logo.png` for traceability.

## Route refresh support

- Vite dev server handles SPA fallbacks during development.
- `vercel.json` and `public/_redirects` are included for common static SPA deployments so refreshing `/add`, `/list`, or `/orders` resolves to `index.html`.
