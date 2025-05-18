import registerSchema from './registerSchema';
import loginSchema from './loginSchema';
import {
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
} from './passwordResetSchemas';
import { createValidators } from './utils';

const BASIC_EMAIL_REGEX = /^\S+@\S+\.\S+$/;

/**
 * Validation configuration for user registration.
 * Includes validation for first name, last name, email, password, and password confirmation.
 *
 * @type {Object}
 * @property {Function} first_name - Validator for first name
 * @property {Function} last_name - Validator for last name
 * @property {Function} email - Validator for email format
 * @property {Function} password - Validator for password
 * @property {Function} re_password - Validator for password confirmation
 *
 * @example
 * registerValidators.first_name('') // returns 'Le prénom est requis'
 */
export const registerValidators = createValidators({
  schema: registerSchema,
  fields: ['first_name', 'last_name', 'email', 'password', 're_password'],
  requiredMessages: {
    first_name: 'Le prénom est requis',
    last_name: 'Le nom est requis',
    email: "L'email est requis",
    password: 'Le mot de passe est requis',
    re_password: 'La confirmation du mot de passe est requise',
  },
  preTests: {
    email: (value) =>
      !BASIC_EMAIL_REGEX.test(value) ? 'Adresse email invalide' : null,
  },
});

/**
 * Validation configuration for user login.
 * Includes validation for email and password fields.
 *
 * @type {Object}
 * @property {Function} email - Validator for email format
 * @property {Function} password - Validator for password
 *
 * @example
 * loginValidators.email('invalid') // returns 'Adresse email invalide'
 */
export const loginValidators = createValidators({
  schema: loginSchema,
  fields: ['email', 'password'],
  requiredMessages: {
    email: "L'email est requis",
    password: 'Le mot de passe est requis',
  },
  preTests: {
    email: (v) =>
      !BASIC_EMAIL_REGEX.test(v) ? 'Adresse email invalide' : null,
  },
});

/**
 * Validation configuration for password reset request.
 * Validates the email field format.
 * Error messages are in French.
 *
 * @type {Object}
 * @property {Function} email - Validator for email format
 *
 * @example
 * forgotPasswordValidators.email('') // returns "L'email est requis"
 */
export const forgotPasswordValidators = createValidators({
  schema: passwordResetRequestSchema,
  fields: ['email'],
  requiredMessages: {
    email: "L'email est requis",
  },
  preTests: {
    email: (v) =>
      !BASIC_EMAIL_REGEX.test(v) ? 'Adresse email invalide' : null,
  },
});

/**
 * Validation configuration for password reset confirmation.
 * Validates UID, token, and new password fields.
 *
 * @type {Object}
 * @property {Function} uid - Validator for UID field
 * @property {Function} token - Validator for token field
 * @property {Function} new_password - Validator for new password
 * @property {Function} re_new_password - Validator for password confirmation
 *
 * @example
 * passwordResetConfirmValidators.new_password('') // returns 'Le nouveau mot de passe est requis'
 */
export const passwordResetConfirmValidators = createValidators({
  schema: passwordResetConfirmSchema,
  fields: ['uid', 'token', 'new_password', 're_new_password'],
  requiredMessages: {
    uid: 'UID manquant',
    token: 'Token manquant',
    new_password: 'Le nouveau mot de passe est requis',
    re_new_password: 'Veuillez confirmer le mot de passe',
  },
});
