import * as Yup from 'yup';

const strictEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

/**
 * Yup validation schema for password reset request.
 * Validates email format with both basic and strict regex patterns.
 *
 * @type {Yup.ObjectSchema}
 * @property {Yup.StringSchema} email - Email validation with:
 *   - Required check
 *   - Basic format validation (simple regex)
 *   - Strict format validation (RFC-compliant regex)
 *
 * @example
 * await passwordResetRequestSchema.validate({ email: 'user@example.com' });
 */
export const passwordResetRequestSchema = Yup.object().shape({
  email: Yup.string()
    .required("L'email est requis")
    .test(
      'basic-email-format',
      'Adresse email invalide',
      (value) => typeof value === 'string' && /^\S+@\S+\.\S+$/.test(value)
    )
    .test(
      'strict-email-format',
      "L'email doit être au format valide, par exemple user@example.com",
      (value) => typeof value === 'string' && strictEmailRegex.test(value)
    ),
});

/**
 * Yup validation schema for password reset confirmation.
 * Validates all fields required for password reset completion.
 *
 * @type {Yup.ObjectSchema}
 * @property {Yup.StringSchema} uid - UID validation (required, alphanumeric)
 * @property {Yup.StringSchema} token - Token validation (required, alphanumeric)
 * @property {Yup.StringSchema} new_password - Password validation with:
 *   - Minimum length (8 characters)
 *   - Lowercase requirement
 *   - Uppercase requirement
 *   - Number requirement
 * @property {Yup.StringSchema} re_new_password - Password confirmation:
 *   - Must match new_password
 *   - Required field
 *
 * @example
 * await passwordResetConfirmSchema.validate({
 *   uid: 'abc123',
 *   token: 'xyz456',
 *   new_password: 'Secure123',
 *   re_new_password: 'Secure123'
 * });
 */
export const passwordResetConfirmSchema = Yup.object().shape({
  uid: Yup.string()
    .required('UID manquant')
    .matches(/^[A-Za-z0-9\-_]+$/, 'UID invalide'),
  token: Yup.string()
    .required('Token manquant')
    .matches(/^[A-Za-z0-9\-_]+$/, 'Token invalide'),
  new_password: Yup.string()
    .required('Le nouveau mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[a-z]/, 'Le mot de passe doit contenir une minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  re_new_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Les mots de passe ne correspondent pas')
    .required('Veuillez confirmer le mot de passe'),
});
