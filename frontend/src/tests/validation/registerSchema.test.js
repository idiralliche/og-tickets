import registerSchema from '../../validation/registerSchema';

/**
 * Test suite for the registerSchema validation.
 * @module RegisterSchemaTests
 * @description Verifies the validation behavior of the registerSchema.
 */
describe('registerSchema', () => {
  /**
   * Valid data object for testing purposes.
   * @type {Object}
   */
  let validData;

  /**
   * Setup function to initialize validData before each test.
   */
  beforeEach(() => {
    validData = {
      first_name: 'Jean',
      last_name: 'Dupont',
      email: 'user@example.com',
      password: 'Password1',
      re_password: 'Password1',
    };
  });

  /**
   * @test {registerSchema} valid data
   * @description Verifies that the registerSchema validates correct data.
   */
  it('validates correct data', () => {
    // Ensure that the validateSync method is available
    expect(typeof registerSchema.validateSync).toBe('function');
    expect(() => registerSchema.validateSync(validData)).not.toThrow();
  });

  /**
   * Test suite for email validation.
   */
  describe('email', () => {
    /**
     * @test {registerSchema} missing email
     * @description Verifies that the registerSchema fails if email is missing.
     */
    it('fails if missing', () => {
      expect(() =>
        registerSchema.validateSync({ ...validData, email: '' })
      ).toThrow("L'email est requis");
    });

    /**
     * @test {registerSchema} invalid email format
     * @description Verifies that the registerSchema fails if email format is invalid (without '@').
     */
    it('fails if basic format is invalid (without "@")', () => {
      expect(() =>
        registerSchema.validateSync({ ...validData, email: 'foobar' })
      ).toThrow('Adresse email invalide');
    });

    /**
     * @test {registerSchema} invalid email regex
     * @description Verifies that the registerSchema fails if email does not pass strict regex.
     */
    it('fails if email does not pass strict regex', () => {
      expect(() =>
        registerSchema.validateSync({
          ...validData,
          email: 'user@ex_ample.com',
        })
      ).toThrow(
        "L'email doit être au format valide, par exemple user@example.com"
      );
    });
  });

  /**
   * Test suite for password validation.
   */
  describe('password', () => {
    /**
     * Helper function to run validation with a specific password.
     * @param {string} pwd - The password to test.
     */
    const run = (pwd) =>
      registerSchema.validateSync({
        ...validData,
        password: pwd,
        re_password: pwd,
      });

    /**
     * @test {registerSchema} short password
     * @description Verifies that the registerSchema fails if password is too short.
     */
    it('fails if too short', () => {
      expect(() => run('P1a')).toThrow(
        'Le mot de passe doit contenir au moins 8 caractères'
      );
    });

    /**
     * @test {registerSchema} no lowercase password
     * @description Verifies that the registerSchema fails if password has no lowercase.
     */
    it('fails if no lowercase', () => {
      expect(() => run('PASSWORD1')).toThrow(
        'Le mot de passe doit contenir une minuscule'
      );
    });

    /**
     * @test {registerSchema} no uppercase password
     * @description Verifies that the registerSchema fails if password has no uppercase.
     */
    it('fails if no uppercase', () => {
      expect(() => run('password1')).toThrow(
        'Le mot de passe doit contenir une majuscule'
      );
    });

    /**
     * @test {registerSchema} no digit password
     * @description Verifies that the registerSchema fails if password has no digit.
     */
    it('fails if no digit', () => {
      expect(() => run('Password')).toThrow(
        'Le mot de passe doit contenir au moins un chiffre'
      );
    });
  });

  /**
   * Test suite for re_password validation.
   */
  describe('re_password', () => {
    /**
     * @test {registerSchema} mismatched re_password
     * @description Verifies that the registerSchema fails if re_password does not match password.
     */
    it('fails if it does not match password', () => {
      expect(() =>
        registerSchema.validateSync({
          ...validData,
          re_password: 'Different1',
        })
      ).toThrow('Les mots de passe doivent correspondre');
    });
  });
});
