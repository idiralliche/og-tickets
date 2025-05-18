import {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  passwordResetConfirmValidators,
} from '../../validation/authValidators';

/**
 * Test suite for login form validators
 * @module LoginValidatorsTests
 * @description Tests email and password validation rules for login form
 */
describe('loginValidators', () => {
  /**
   * @type {Function}
   * @description Validator function for login email field
   */
  const vEmail = loginValidators.email;

  /**
   * @type {Function}
   * @description Validator function for password field from loginValidators
   */
  const vPwd = loginValidators.password;

  /**
   * @test {loginValidators.email}
   * @description Tests email validation scenarios:
   * - Empty email shows required message
   * - Invalid format shows format error
   * - Valid email passes validation
   */
  it('validates email (required/invalid format)', () => {
    expect(vEmail('', { email: '' })).toBe("L'email est requis");
    expect(vEmail('foo@bar', { email: 'foo@bar' })).toBe(
      'Adresse email invalide'
    );
    expect(vEmail('user@example.com', { email: 'user@example.com' })).toBe('');
  });

  /**
   * Test suite for registration form validation
   * @module RegisterValidatorsTests
   * @description Tests validation rules for all fields in the registration form
   * Includes first name, last name, email, password and password confirmation
   */
  it('validates password (required)', () => {
    expect(vPwd('', { password: '' })).toBe('Le mot de passe est requis');
    expect(vPwd('whatever', { password: 'whatever' })).toBe('');
  });
});

/**
 * Test suite for registration form validators
 * @module RegisterValidatorsTests
 * @description Tests all field validation rules for user registration
 */
describe('registerValidators', () => {
  /**
   * @type {Object}
   * @description Reference to all register validators
   */
  const vals = registerValidators;

  /**
   * @type {Object}
   * @description Sample valid data that would pass all validations
   */
  const good = {
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jd@example.com',
    password: 'Password1',
    re_password: 'Password1',
  };

  /**
   * @test {registerValidators.first_name}
   * @description Verifies first name field shows required message when empty
   */
  it('detects empty first name', () => {
    expect(vals.first_name('', { ...good, first_name: '' })).toBe(
      'Le prénom est requis'
    );
  });

  /**
   * @test {registerValidators.last_name}
   * @description Verifies last name field shows required message when empty
   */
  it('detects empty last name', () => {
    expect(vals.last_name('', { ...good, last_name: '' })).toBe(
      'Le nom est requis'
    );
  });

  /**
   * @test {registerValidators.email}
   * @description Verifies email field shows format error for invalid email
   */
  it('should detect invalid email', () => {
    expect(vals.email('foo@bar', { ...good, email: 'foo@bar' })).toBe(
      'Adresse email invalide'
    );
  });

  /**
   * @test {registerValidators.password}
   * @description Tests password validation:
   * - Shows required message when empty
   * - Shows length requirement when too short
   */
  it('should detect required or malformed password', () => {
    expect(vals.password('', { ...good, password: '', re_password: '' })).toBe(
      'Le mot de passe est requis'
    );
    expect(
      vals.password('abc', { ...good, password: 'abc', re_password: 'abc' })
    ).toMatch(/au moins 8 caractères/);
  });

  /**
   * @test {registerValidators.re_password}
   * @description Tests password confirmation validation:
   * - Shows required message when empty
   * - Shows mismatch message when passwords don't match
   */
  it('should detect required or mismatched re_password', () => {
    expect(vals.re_password('', { ...good, re_password: '' })).toBe(
      'La confirmation du mot de passe est requise'
    );
    expect(
      vals.re_password('Xyz12345', {
        ...good,
        password: 'Password1',
        re_password: 'Xyz12345',
      })
    ).toBe('Les mots de passe doivent correspondre');
  });
});

/**
 * Test suite for forgot password validation
 * @module ForgotPasswordValidatorsTests
 * @description Tests email validation for password reset request form
 */
describe('forgotPasswordValidators', () => {
  /**
   * @type {Function}
   * @description Validator function for email field from forgotPasswordValidators
   */
  const v = forgotPasswordValidators.email;

  /**
   * @test {forgotPasswordValidators.email}
   * @description Tests email validation scenarios:
   * - Shows required message when empty
   * - Shows invalid format message for basic format violations
   * - Shows strict format message when basic passes but strict validation fails
   */
  it('should require email / detect invalid format', () => {
    expect(v('', { email: '' })).toBe("L'email est requis");
    expect(v('foo@bar', { email: 'foo@bar' })).toBe('Adresse email invalide');
    // 'u@e.c' passes basic test but fails strict regex
    expect(v('u@e.c', { email: 'u@e.c' })).toBe(
      "L'email doit être au format valide, par exemple user@example.com"
    );
  });
});

/**
 * Test suite for password reset confirmation validation
 * @module PasswordResetConfirmValidatorsTests
 * @description Tests validation rules for password reset confirmation form
 */
describe('passwordResetConfirmValidators', () => {
  /**
   * @type {Object}
   * @description Reference to all password reset confirmation validators
   */
  const fields = passwordResetConfirmValidators;

  /**
   * @test {passwordResetConfirmValidators.uid}
   * @test {passwordResetConfirmValidators.token}
   * @description Verifies uid and token fields show required messages when empty
   */
  it('should require uid and token', () => {
    expect(fields.uid('', { uid: '' })).toBe('UID manquant');
    expect(fields.token('', { token: '' })).toBe('Token manquant');
  });

  /**
   * @test {passwordResetConfirmValidators.new_password}
   * @description Tests new password validation:
   * - Shows required message when empty
   * - Shows length requirement when too short
   */
  it('should require new_password and enforce strength', () => {
    expect(fields.new_password('', { new_password: '' })).toBe(
      'Le nouveau mot de passe est requis'
    );
    expect(fields.new_password('short', { new_password: 'short' })).toMatch(
      /au moins 8 caractères/
    );
  });

  /**
   * @test {passwordResetConfirmValidators.re_new_password}
   * @description Tests password confirmation validation:
   * - Shows required message when empty
   * - Shows mismatch message when passwords don't match
   */
  it('should require re_new_password and ensure match', () => {
    expect(
      fields.re_new_password('', {
        new_password: 'Pwd12345',
        re_new_password: '',
      })
    ).toBe('Veuillez confirmer le mot de passe');
    expect(
      fields.re_new_password('wrong', {
        new_password: 'Pwd12345',
        re_new_password: 'wrong',
      })
    ).toBe('Les mots de passe ne correspondent pas');
  });
});
