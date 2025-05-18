import { useState, useContext, useCallback } from 'react';
import useForm from './useForm';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Custom hook for handling form actions with validation and submission logic.
 *
 * @param {Object} config - Configuration object for the form action.
 * @param {Object} config.initialValues - Initial values for the form fields.
 * @param {Object} [config.validators={}] - Validation functions for each field.
 * @param {Function} config.serviceFunction - Async function to call on form submission.
 * @param {Function} config.onSubmit - Callback executed after successful submission.
 * @param {string} config.actionName - Name of the action for error messages (e.g., "connexion").
 * @returns {Object} Form state and handlers including:
 *   - values: Current form values
 *   - errors: Validation errors
 *   - touched: Touched state of fields
 *   - handleChange: Change handler
 *   - handleBlur: Blur handler
 *   - handleSubmit: Submission handler
 *   - isSubmitDisabled: Boolean if submission is disabled
 *   - status: Current status ('idle' | 'loading' | 'success' | 'error')
 *
 * @example
 * const { values, handleSubmit } = useFormAction({
 *   initialValues: { email: '', password: '' },
 *   serviceFunction: loginUser,
 *   onSubmit: (data) => redirectToDashboard(),
 *   actionName: 'connexion'
 * });
 */
export default function useFormAction({
  initialValues,
  validators = {},
  serviceFunction,
  onSubmit,
  actionName,
}) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const { showNotification } = useContext(NotificationContext);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useForm(initialValues, validators);

  const isSubmitDisabled = Object.values(errors).some(Boolean);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const newErrors = validateAll();
      if (Object.values(newErrors).some(Boolean)) {
        showNotification(
          'Veuillez corriger les erreurs dans le formulaire.',
          'error'
        );
        return;
      }

      setStatus('loading');
      try {
        const data = await serviceFunction(values);
        resetForm();
        setStatus('success');
        onSubmit(data);
      } catch (error) {
        const errorMessage = `Erreur: Votre ${actionName} n'a pas abouti.`;
        console.error(`${errorMessage} :`, error);
        showNotification(errorMessage, 'error');
        setStatus('error');
      }
    },
    [
      values,
      validateAll,
      resetForm,
      serviceFunction,
      showNotification,
      onSubmit,
      actionName,
    ]
  );

  const authFormState = {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
    status,
  };

  return authFormState;
}
