import React from 'react';
import FormField from './FormField.js';

const AuthFields = ({ fields, submitButtonLabel, authFormState }) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = authFormState;

  return (
    <form
      className='auth-form register-form'
      onSubmit={handleSubmit}
      autoComplete='off'
      noValidate
    >
      {fields.map(({ name, label, type, autoComplete }) => (
        <FormField
          key={name}
          name={name}
          label={label}
          type={type}
          value={values[name]}
          onChange={handleChange(name)}
          onBlur={handleBlur(name)}
          error={errors[name]}
          touched={touched[name]}
          autoComplete={autoComplete}
        />
      ))}
      <button type='submit' className='button' disabled={isSubmitDisabled}>
        {submitButtonLabel}
      </button>
    </form>
  );
};

export default AuthFields;
