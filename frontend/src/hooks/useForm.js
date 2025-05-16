import { useState } from 'react';

/**
 * Custom hook for managing form state with blur-triggered validation.
 *
 * @param {Object} initialValues - Initial form field values.
 * @param {Object} validators - Map of field names to validation functions: (value, allValues) => errorMessage.
 * @returns {Object} - values, errors, touched, handleChange, handleBlur, validateAll, resetForm
 */
const useForm = (initialValues, validators = {}) => {
  // Current values of form fields
  const [values, setValues] = useState(initialValues);
  // Error messages for each field
  const [errors, setErrors] = useState(
    Object.keys(initialValues).reduce(
      (accumulator, key) => ({ ...accumulator, [key]: '' }),
      {}
    )
  );
  // Track if a field has been blurred at least once
  const [touched, setTouched] = useState(
    Object.keys(initialValues).reduce(
      (accumulator, key) => ({ ...accumulator, [key]: false }),
      {}
    )
  );

  /**
   * Updates form field value without triggering validation.
   */
  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    setValues((previousValues) => ({ ...previousValues, [field]: newValue }));
  };

  /**
   * Marks field as touched and triggers validation for that field.
   */
  const handleBlur = (field) => (event) => {
    setTouched((previousTouched) => ({ ...previousTouched, [field]: true }));
    if (validators[field]) {
      const errorMessage = validators[field](values[field], values);
      setErrors((previousErrors) => ({
        ...previousErrors,
        [field]: errorMessage,
      }));
    }
  };

  /**
   * Validates all fields (useful on form submit) and marks all as touched.
   * @returns {Object} newErrors
   */
  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      newErrors[field] = validators[field](values[field], values);
    });
    setErrors(newErrors);
    // Mark every field as touched
    const allTouched = Object.keys(initialValues).reduce(
      (accumulator, key) => ({ ...accumulator, [key]: true }),
      {}
    );
    setTouched(allTouched);
    return newErrors;
  };

  /**
   * Resets form to initial state: values, errors, touched.
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors(
      Object.keys(initialValues).reduce(
        (accumulator, key) => ({ ...accumulator, [key]: '' }),
        {}
      )
    );
    setTouched(
      Object.keys(initialValues).reduce(
        (accumulator, key) => ({ ...accumulator, [key]: false }),
        {}
      )
    );
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  };
};

export default useForm;
