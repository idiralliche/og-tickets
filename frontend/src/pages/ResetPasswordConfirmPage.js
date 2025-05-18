import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import useFormAction from '../hooks/useFormAction';
import usePasswordResetConfirmSubmit from '../hooks/usePasswordResetConfirmSubmit.js';
import { passwordResetConfirmValidators } from '../validation/authValidators';
import { resetPasswordConfirm } from '../services/resetPasswordService.js';
import Form from '../components/Form.js';

/**
 * Page component for password reset confirmation.
 * Handles the final step of password reset process with token validation.
 *
 * @component
 * @returns {JSX.Element} The password reset confirmation page with either:
 *   - A form to set new password (default state)
 *   - A success message with login link (after successful submission)
 *
 * @example
 * <Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordConfirmPage />} />
 *
 * @description
 * This component expects URL parameters:
 * - uid: User identifier from reset link
 * - token: Security token from reset link
 *
 * On successful submission, displays confirmation and login link.
 */
export default function ResetPasswordConfirmPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';

  const authFormState = useFormAction({
    initialValues: { uid, token, new_password: '', re_new_password: '' },
    validators: passwordResetConfirmValidators,
    serviceFunction: resetPasswordConfirm,
    onSubmit: usePasswordResetConfirmSubmit(),
    actionName: 'réinitialisation de mot de passe',
  });

  const status = authFormState.status;
  const fields = [
    { name: 'uid', type: 'hidden' },
    { name: 'token', type: 'hidden' },
    {
      name: 'new_password',
      label: 'Nouveau mot de passe :',
      type: 'password',
      autoComplete: 'new-password',
    },
    {
      name: 're_new_password',
      label: 'Confirmez le mot de passe :',
      type: 'password',
      autoComplete: 'new-password',
    },
  ];

  return (
    <Layout
      title='Choisissez un nouveau mot de passe'
      mainClassName='account-page'
    >
      <div className='auth-container'>
        <div className='auth-content'>
          {status === 'success' ? (
            <div className='confirmation container'>
              <p>
                Mot de passe changé ! Vous pouvez maintenant
                vous&nbsp;connecter.
              </p>
              <Link to='/acces'>Se connecter</Link>
            </div>
          ) : (
            <Form
              fields={fields}
              submitButtonLabel={'Valider'}
              formState={authFormState}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
