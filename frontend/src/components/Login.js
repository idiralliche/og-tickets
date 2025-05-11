import React from 'react';
import useAuthForm from '../hooks/useAuthForm';
import { loginValidators } from '../validation/authValidators';
import { authService } from '../services/authService';
import AuthFields from './AuthFields';

const Login = () => {
  const initialValues = {
    email: '',
    password: '',
  };

  const authFormState = useAuthForm(
    initialValues,
    loginValidators,
    authService.login,
    {
      successMessage: 'Connexion réussie !',
      failureMessage: 'Identifiants invalides.',
      doLogin: true,
      redirectPath: '/',
    }
  );

  const fields = [
    {
      name: 'email',
      label: 'Email :',
      type: 'email',
      autoComplete: 'username',
    },
    {
      name: 'password',
      label: 'Mot de passe :',
      type: 'password',
      autoComplete: 'current-password',
    },
  ];

  return (
    <AuthFields
      fields={fields}
      submitButtonLabel={'Se connecter'}
      authFormState={authFormState}
    />
  );
};

export default Login;
