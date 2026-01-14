# neon---pos

## Responsive behavior ✅

This frontend is responsive across common breakpoints and scales the POS workspace for small screens. Key behaviours:

- Product grid: automatically switches between 1 / 2 / 3 columns depending on width (mobile / tablet / desktop).
- Product cards: compact on small screens (reduced height & typography), full details on larger screens.
- Cart & Receipt panels: stack vertically on small screens and are limited in height (scrollable) to avoid overflow.
- Payment modal: becomes scrollable and fits within the viewport on small devices.

To test: run `npm run dev` in `frontend` and open the UI at different viewport sizes (Vite shows the local URL in the terminal).