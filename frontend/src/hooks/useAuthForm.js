import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from './useForm';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

export default function useAuthForm(
  initialValues,
  validators,
  serviceFunction,
  {
    successMessage = 'Opération réussie.',
    failureMessage = 'Une erreur est survenue.',
    doLogin = false,
    redirectPath = '/',
  }
) {
  const { login } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useForm(initialValues, validators);

  const isSubmitDisabled = Object.values(errors).some((msg) => msg);

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

      try {
        const data = await serviceFunction(values);
        resetForm();
        if (!doLogin) {
          // REGISTER
          showNotification(successMessage, 'success');
        } else if (data && data.access) {
          // LOGIN
          login(data.access);
          navigate(redirectPath);
          showNotification(successMessage, 'success');
        } else {
          showNotification(failureMessage, 'error');
        }
      } catch (error) {
        const errorMessage = `Erreur lors de la tentative ${
          doLogin ? 'de connexion' : 'd’inscription'
        }`;
        console.error(`${errorMessage} :`, error);
        showNotification(errorMessage, 'error');
      }
    },
    [
      values,
      validateAll,
      resetForm,
      serviceFunction,
      showNotification,
      successMessage,
      failureMessage,
      doLogin,
      login,
      navigate,
      redirectPath,
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
  };

  return authFormState;
}
