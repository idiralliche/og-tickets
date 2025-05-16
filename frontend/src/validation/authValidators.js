import registerSchema from './registerSchema';
import loginSchema from './loginSchema';

/**
 * Validation functions for the registration form,
 * wrapping Yup.validateSyncAt for chaque champ.
 */
export const registerValidators = {
  first_name: (value, allValues) => {
    try {
      registerSchema.validateSyncAt('first_name', allValues);
      return '';
    } catch (err) {
      return err.message;
    }
  },
  last_name: (value, allValues) => {
    try {
      registerSchema.validateSyncAt('last_name', allValues);
      return '';
    } catch (err) {
      return err.message;
    }
  },
  email: (value, allValues) => {
    try {
      registerSchema.validateSyncAt('email', allValues);
      return '';
    } catch (err) {
      return err.message;
    }
  },
  password: (value, allValues) => {
    try {
      registerSchema.validateSyncAt('password', allValues);
      return '';
    } catch (err) {
      return err.message;
    }
  },
  re_password: (value, allValues) => {
    try {
      registerSchema.validateSyncAt('re_password', allValues);
      return '';
    } catch (err) {
      return err.message;
    }
  },
};

/**
 * Validation functions for the login form,
 * wrapping Yup.validateSyncAt for chaque champ.
 */
export const loginValidators = {
  email: (value, allValues) => {
    try {
      loginSchema.validateSyncAt('email', allValues);
      return '';
    } catch (err) {
      return err.message;
    }
  },
  password: (value, allValues) => {
    try {
      loginSchema.validateSyncAt('password', allValues);
      return '';
    } catch (err) {
      return err.message;
    }
  },
};
