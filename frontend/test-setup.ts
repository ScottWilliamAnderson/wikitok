// frontend/test-setup.ts

// Inform React that we are in a test environment that supports act.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import { Window } from "happy-dom";

// create a new instance of Window from Happy DOM
const windowInstance = new Window();

// assign the global browser objects to the Happy DOM instance
globalThis.window = windowInstance;
globalThis.document = windowInstance.document;
globalThis.navigator = windowInstance.navigator;

// explicitly assign localStorage (and any other globals you might need)
globalThis.localStorage = windowInstance.localStorage;
