import React from 'react';
import { Link } from 'react-router-dom';
import useFormAction from '../hooks/useFormAction';
import useLoginSubmit from '../hooks/useLoginSubmit';
import { loginValidators } from '../validation/authValidators';
import { authService } from '../services/authService';
import Form from './Form';

/**
 * Login form component handling user authentication.
 *
 * @component
 * @returns {JSX.Element} The login form with email/password fields and a "forgot password" link.
 *
 * @example
 * <Route path="/login" element={<Login />} />
 *
 * @description
 * Features:
 * - Form validation using loginValidators
 * - Integration with authService for authentication
 * - Automatic redirect after successful login (handled by useLoginSubmit)
 * - "Forgot password" link
 */
const Login = () => {
  const onLoginSubmit = useLoginSubmit();
  const authFormState = useFormAction({
    initialValues: {
      email: '',
      password: '',
    },
    validators: loginValidators,
    serviceFunction: authService.login,
    onSubmit: onLoginSubmit,
    actionName: 'connexion',
  });

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
    <>
      <Form
        fields={fields}
        submitButtonLabel={'Se connecter'}
        formState={authFormState}
      />
      <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
        <Link to='/acces/break' className='link'>
          Mot de passe oublié ?
        </Link>
      </div>
    </>
  );
};

export default Login;
