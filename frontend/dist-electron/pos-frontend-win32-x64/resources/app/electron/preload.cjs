const { contextBridge } = require('electron');

// Minimal preload that exposes an empty `electron` object. Add APIs here if you need native features later.
contextBridge.exposeInMainWorld('electron', {});
