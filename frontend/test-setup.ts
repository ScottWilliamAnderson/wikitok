// frontend/test-setup.ts

// Import the helper to install DOM globals from happy-dom
import { installGlobals } from "happy-dom";

// Install window, document, and other browser globals into the Bun runtime
installGlobals();
