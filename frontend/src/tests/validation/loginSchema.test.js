import loginSchema from '../../validation/loginSchema';

/**
 * Test suite for the loginSchema validation.
 * @module LoginSchemaTests
 * @description Verifies the validation behavior of the loginSchema.
 */
describe('loginSchema', () => {
  /**
   * @test {loginSchema} valid email and password
   * @description Verifies that the loginSchema validates a correct email and password.
   */
  it('validates a valid email and password', () => {
    expect(() => {
      loginSchema.validateSync({
        email: 'user@example.com',
        password: 'monpassword',
      });
    }).not.toThrow();
  });

  /**
   * @test {loginSchema} empty email
   * @description Verifies that the loginSchema fails if the email is empty.
   */
  it('fails if the email is empty', () => {
    expect(() => {
      loginSchema.validateSync({
        email: '',
        password: 'monpassword',
      });
    }).toThrow("L'email est requis");
  });

  /**
   * @test {loginSchema} invalid email format
   * @description Verifies that the loginSchema fails if the email is not in a valid format.
   */
  it('fails if the email is not in a valid format', () => {
    expect(() => {
      loginSchema.validateSync({
        email: 'user-at-example.com',
        password: 'monpassword',
      });
    }).toThrow('Adresse email invalide');
  });

  /**
   * @test {loginSchema} email with invalid characters (space)
   * @description Verifies that the loginSchema fails if the email contains invalid characters (space).
   */
  it('fails if the email contains invalid characters (space)', () => {
    expect(() => {
      loginSchema.validateSync({
        email: 'user@ex ample.com',
        password: 'monpassword',
      });
    }).toThrow('Adresse email invalide');
  });

  /**
   * @test {loginSchema} empty password
   * @description Verifies that the loginSchema fails if the password is empty.
   */
  it('fails if the password is empty', () => {
    expect(() => {
      loginSchema.validateSync({
        email: 'user@example.com',
        password: '',
      });
    }).toThrow('Le mot de passe est requis');
  });
});
