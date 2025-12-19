# Electron setup (Windows only - distributable folder)

## Dev

- Install dev deps: `npm install` (this will include `electron`, `concurrently`, `wait-on`)
- Start dev (runs Vite and Electron):

```bash
npm run dev:electron
```

This starts the Vite dev server on `http://localhost:5173` and launches Electron that loads that URL.

## Build & package (distributable folder)

- Build the frontend and package into `dist-electron/` folder:

```bash
npm run build:desktop
```

After it finishes, you'll find a Windows app folder in `dist-electron/` (named `pos-frontend-win32-x64` or similar). The folder is a usable distributable (no installer).

## Notes

- The `main` entry is `electron/main.js` and the `preload` script is `electron/preload.js`.
- For production the app loads the built `dist/index.html`.
- If you want an installer (.exe / .msi) later, we can switch to `electron-builder`.
