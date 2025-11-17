// Wrapper for CKEditor Field to ensure proper Payload CMS integration
// This wrapper ensures onChange is properly passed from Payload to CKEditor

const CKEditorField = require('./CKEditorField');

// Export a wrapper that Payload CMS can use
const CKEditorFieldWrapper = (props) => {
  // Log what Payload is passing
  console.log('CKEditorFieldWrapper received props:', {
    hasValue: !!props.value,
    hasOnChange: !!props.onChange,
    path: props.path,
    allProps: Object.keys(props)
  });

  // Pass all props to CKEditor
  return CKEditorField(props);
};

module.exports = CKEditorFieldWrapper;
