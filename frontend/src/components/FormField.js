import React from 'react';

/**
 * Reusable FormField with touched and error integration
 * Props:
 *  - label: label text
 *  - name: field name/id
 *  - type: input type
 *  - value, onChange, onBlur
 *  - error: error message (string)
 *  - touched: boolean indicating if the field was touched (blurred)
 */
const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  autoComplete = 'off',
}) => {
  // Only shows the error and applies the class after first blur (touched)
  const hasError = touched && Boolean(error);
  return (
    <div className='form-field'>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={hasError ? 'input-error' : ''}
        autoComplete={autoComplete}
        spellcheck='false'
        autocorrect='off'
        autocapitalize='none'
        required
      />
      {hasError && <div className='error-message'>{error}</div>}
    </div>
  );
};

export default FormField;
