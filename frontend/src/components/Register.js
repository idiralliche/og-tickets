import React from 'react';
import useAuthForm from '../hooks/useAuthForm';
import { registerValidators } from '../validation/authValidators';
import { authService } from '../services/authService';
import AuthFields from './AuthFields';

const Register = ({ onSwitchToLogin, formKey }) => {
  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  };

  const authFormState = useAuthForm(
    initialValues,
    registerValidators,
    authService.register,
    {
      successMessage: 'Inscription réussie ! Vérifiez votre email.',
      failureMessage: 'Échec de l’inscription.',
      doLogin: false,
    }
  );

  const fields = [
    {
      name: 'first_name',
      label: 'Prénom :',
      type: 'text',
      autoComplete: 'given-name',
    },
    {
      name: 'last_name',
      label: 'Nom :',
      type: 'text',
      autoComplete: 'family-name',
    },
    { name: 'email', label: 'Email :', type: 'email', autoComplete: 'email' },
    {
      name: 'password',
      label: 'Mot de passe :',
      type: 'password',
      autoComplete: 'new-password',
    },
    {
      name: 're_password',
      label: 'Confirmer le mot de passe :',
      type: 'password',
      autoComplete: 'off',
    },
  ];

  return (
    <AuthFields
      fields={fields}
      submitButtonLabel={'S’inscrire'}
      authFormState={authFormState}
    />
  );
};

export default Register;
