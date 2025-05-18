import * as Yup from 'yup';

const strictEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

/**
 * Yup validation schema for user registration.
 * Validates all fields required for creating a new user account.
 *
 * @type {Yup.ObjectSchema}
 * @property {Yup.StringSchema} first_name - First name validation:
 *   - Required field
 *   - Allows letters, accents, spaces, hyphens and apostrophes
 * @property {Yup.StringSchema} last_name - Last name validation:
 *   - Required field
 *   - Same character rules as first_name
 * @property {Yup.StringSchema} email - Email validation:
 *   - Required field
 *   - Basic email format check
 *   - Strict RFC-compliant email validation
 * @property {Yup.StringSchema} password - Password validation:
 *   - Minimum 8 characters
 *   - Requires lowercase letter
 *   - Requires uppercase letter
 *   - Requires number
 * @property {Yup.StringSchema} re_password - Password confirmation:
 *   - Must match password field
 *   - Required field
 *
 * @example
 * await registerSchema.validate({
 *   first_name: 'Jean',
 *   last_name: 'Dupont',
 *   email: 'jean.dupont@example.com',
 *   password: 'Secure123',
 *   re_password: 'Secure123'
 * });
 */
const registerSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Le prénom est requis')
    .matches(
      /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/,
      'Le prénom contient des caractères invalides'
    ),
  last_name: Yup.string()
    .required('Le nom est requis')
    .matches(
      /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/,
      'Le nom contient des caractères invalides'
    ),
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
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .required('Le mot de passe est requis')
    .matches(/[a-z]/, 'Le mot de passe doit contenir une minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  re_password: Yup.string()
    .oneOf(
      [Yup.ref('password'), null],
      'Les mots de passe doivent correspondre'
    )
    .required('La confirmation du mot de passe est requise'),
});

export default registerSchema;
