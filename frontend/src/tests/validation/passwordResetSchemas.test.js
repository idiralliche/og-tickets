import { passwordResetRequestSchema } from '../../validation/passwordResetSchemas';

/**
 * Test suite for passwordResetRequestSchema validation.
 * @module PasswordResetRequestSchemaTests
 * @description Verifies email validation rules for password reset requests.
 * Tests include format validation and error messaging in French.
 */
describe('passwordResetRequestSchema', () => {
  const validData = { email: 'user@example.com' };

  /**
   * @test {passwordResetRequestSchema} valid email
   * @description Accepts a properly formatted email address
   */
  it('validates correct email', () => {
    expect(() =>
      passwordResetRequestSchema.validateSync(validData)
    ).not.toThrow();
  });

  /**
   * @test {passwordResetRequestSchema} missing email
   * @description Rejects empty email with required field message (French)
   */
  it('fails when email is missing', () => {
    expect(() =>
      passwordResetRequestSchema.validateSync({ email: '' })
    ).toThrow("L'email est requis");
  });

  /**
   * @test {passwordResetRequestSchema} basic format - missing @
   * @description Rejects email missing @ symbol with invalid format message (French)
   */
  it('fails with invalid basic format (missing @)', () => {
    expect(() =>
      passwordResetRequestSchema.validateSync({ email: 'foo' })
    ).toThrow('Adresse email invalide');
  });

  /**
   * @test {passwordResetRequestSchema} basic format - missing domain
   * @description Rejects email with incomplete domain with invalid format message (French)
   */
  it('fails with invalid basic format (missing domain)', () => {
    expect(() =>
      passwordResetRequestSchema.validateSync({ email: 'foo@bar' })
    ).toThrow('Adresse email invalide');
  });

  /**
   * @test {passwordResetRequestSchema} strict format validation
   * @description Rejects email that passes basic but fails strict validation
   * with specific format example message (French)
   */
  it('fails when passing basic test but failing strict test', () => {
    // This email has @ and dot but isn't allowed by strict regex
    const almostValid = 'user@ex_ample.com';
    expect(() =>
      passwordResetRequestSchema.validateSync({ email: almostValid })
    ).toThrow(
      "L'email doit être au format valide, par exemple user@example.com"
    );
  });
});
