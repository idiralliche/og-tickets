import React from 'react';
import useFormAction from '../hooks/useFormAction';
import useRegisterSubmit from '../hooks/useRegisterSubmit';
import { registerValidators } from '../validation/authValidators';
import { authService } from '../services/authService';
import Form from './Form';

/**
 * Registration form component for new user account creation.
 *
 * @component
 * @returns {JSX.Element} A form with fields for user registration including:
 *   - First name
 *   - Last name
 *   - Email
 *   - Password
 *   - Password confirmation
 *
 * @example
 * <Route path="/register" element={<Register />} />
 *
 * @description
 * Handles the complete user registration flow:
 * - Validates all fields using registerValidators
 * - Submits data via authService.register
 * - Processes successful registration with useRegisterSubmit
 * - Includes password confirmation field
 */
const Register = () => {
  const onRegisterSubmit = useRegisterSubmit();
  const authFormState = useFormAction({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      re_password: '',
    },
    validators: registerValidators,
    serviceFunction: authService.register,
    onSubmit: onRegisterSubmit,
    actionName: 'inscription',
  });

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
    <Form
      fields={fields}
      submitButtonLabel={'S’inscrire'}
      formState={authFormState}
    />
  );
};

export default Register;
