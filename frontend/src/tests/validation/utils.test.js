import * as Yup from 'yup';
import { createValidators } from '../../validation/utils';

/**
 * Test suite for createValidators utility function
 * @module CreateValidatorsTests
 * @description Tests the behavior of validation functions created by createValidators
 * including required checks, pre-tests, and Yup schema validations
 */
describe('createValidators', () => {
  /**
   * @type {Object}
   * @description Test Yup schema with two fields:
   * - a: string with min length 3, uppercase only, required
   * - b: positive number, required
   */
  const schema = Yup.object().shape({
    a: Yup.string()
      .min(3, 'a doit faire au moins 3 caractères')
      .matches(/^[A-Z]+$/, 'a doit être en majuscules')
      .required('a requis'),
    b: Yup.number().positive('b doit être positif').required('b requis'),
  });

  /**
   * @type {Object}
   * @description Pre-test validators that run before Yup validation
   * Field a: forbids '!' character in the string
   */
  const preTests = {
    a: (value) =>
      typeof value === 'string' && value.includes('!')
        ? 'a ne doit pas contenir !'
        : null,
  };

  /**
   * @type {Object}
   * @description Validator functions created by the createValidators utility
   * Contains validation functions for fields a and b
   */
  const validators = createValidators({
    schema,
    fields: ['a', 'b'],
    requiredMessages: { a: 'a requis', b: 'b requis' },
    preTests,
  });

  /**
   * @test {createValidators}
   * @description Tests that empty values trigger required error messages
   * - Empty string for field a returns required message
   * - Undefined value for field b returns required message
   */
  it('returns required message when empty', () => {
    expect(validators.a('', {})).toBe('a requis');
    expect(validators.b(undefined, {})).toBe('b requis');
  });

  /**
   * @test {createValidators}
   * @description Tests that pre-test validations take precedence over Yup validations
   * Even when other validations would fail, the pre-test message is returned first
   */
  it('returns preTest message before Yup validations', () => {
    // Even if length <3, the pre-test takes precedence
    expect(validators.a('!A', { a: '!A', b: 1 })).toBe(
      'a ne doit pas contenir !'
    );
  });

  /**
   * @test {createValidators}
   * @description Tests that Yup schema validations work correctly
   * when pre-tests and required checks pass but schema validation fails
   */
  it('returns Yup error when preTest and required checks pass', () => {
    expect(validators.a('AB', { a: 'AB', b: 1 })).toBe(
      'a doit faire au moins 3 caractères'
    );
    expect(validators.b(-5, { a: 'ABC', b: -5 })).toBe('b doit être positif');
  });

  /**
   * @test {createValidators}
   * @description Verifies that valid values return empty string (no errors)
   * when all validation criteria are met
   */
  it('returns nothing when all validations pass', () => {
    expect(validators.a('ABC', { a: 'ABC', b: 1 })).toBe('');
    expect(validators.b(42, { a: 'XYZ', b: 42 })).toBe('');
  });
});
