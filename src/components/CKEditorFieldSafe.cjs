// Safe CKEditor wrapper for Payload CMS
// This file uses .cjs extension to ensure CommonJS loading
// and lazy-loads the actual CKEditor component only in the browser

module.exports = {
  // Export a component that will be loaded by Payload's webpack
  default: () => {
    // Dynamically import the JSX component only when needed
    // This prevents Node.js from trying to parse JSX during config loading
    return require('./CKEditorPayloadField.jsx').default;
  }
};
