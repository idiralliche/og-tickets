import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import usePasswordResetSubmit from '../hooks/usePasswordResetSubmit';
import useFormAction from '../hooks/useFormAction';
import { forgotPasswordValidators } from '../validation/authValidators';
import { requestPasswordReset } from '../services/resetPasswordService';
import Form from '../components/Form';

/**
 * Page component for handling password reset requests.
 * Displays a form to request password reset link or success message after submission.
 *
 * @component
 * @returns {JSX.Element} The forgot password page with either:
 *   - A form to submit email for password reset (default state)
 *   - A success confirmation message (after successful submission)
 *
 * @example
 * <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
 */
export default function ForgotPasswordPage() {
  const onPasswordResetSubmit = usePasswordResetSubmit();
  const authFormState = useFormAction({
    initialValues: { email: '' },
    validators: forgotPasswordValidators,
    serviceFunction: requestPasswordReset,
    onSubmit: onPasswordResetSubmit,
    actionName: 'demande de réinitialisation de mot de passe',
  });

  const status = authFormState.status;
  const fields = [
    {
      name: 'email',
      label: 'Adresse email :',
      type: 'email',
      autoComplete: 'email',
    },
  ];

  return (
    <Layout title='Réinitialiser le mot de passe' mainClassName='account-page'>
      <div className='auth-container'>
        <div className='auth-content'>
          {status === 'success' ? (
            <div className='confirmation container'>
              <p>Lien de réinitialisation envoyé !</p>
              <Link to='/acces'>Retour à la page de connexion</Link>
            </div>
          ) : (
            <Form
              fields={fields}
              submitButtonLabel={'valider'}
              formState={authFormState}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
