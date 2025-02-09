// frontend/test-setup.ts

import { Window } from "happy-dom";

// create a new instance of Window from Happy DOM
const windowInstance = new Window();

// assign the global browser objects to the Happy DOM instance
globalThis.window = windowInstance;
globalThis.document = windowInstance.document;
globalThis.navigator = windowInstance.navigator;
