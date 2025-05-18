import React from 'react';
import FormField from './FormField.js';
import LoadingSpinner from './LoadingSpinner.js';

const Form = ({ fields, submitButtonLabel, formState }) => {
  const {
    values,
    errors,
    status,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = formState;

  return (
    <form
      className='form'
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
      {status === 'loading' ? (
        <LoadingSpinner />
      ) : (
        <button type='submit' className='button' disabled={isSubmitDisabled}>
          {submitButtonLabel}
        </button>
      )}
    </form>
  );
};

export default Form;
