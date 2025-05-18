/**
 * Creates a collection of validator functions from a Yup schema with additional validation layers.
 *
 * @function
 * @param {Object} config - Configuration object
 * @param {Yup.ObjectSchema} config.schema - Base Yup validation schema
 * @param {string[]} config.fields - Field names to generate validators for
 * @param {Object} [config.requiredMessages={}] - Custom required messages per field
 * @param {Object} [config.preTests={}] - Pre-validation tests to run before Yup validation
 * @returns {Object} An object with validator functions for each specified field
 *
 * @example
 * const validators = createValidators({
 *   schema: userSchema,
 *   fields: ['email', 'password'],
 *   requiredMessages: {
 *     email: 'Email is required',
 *     password: 'Password is required'
 *   },
 *   preTests: {
 *     email: (value) => !value.includes('@') ? 'Invalid format' : null
 *   }
 * });
 *
 * @description
 * Each generated validator performs validation in 3 steps:
 * 1. Required check (with custom message if provided)
 * 2. Pre-test validation (if provided for the field)
 * 3. Yup schema validation (as fallback)
 *
 * Validator functions return:
 * - Empty string ('') for valid fields
 * - Error message string for invalid fields
 */
export function createValidators({
  schema,
  fields,
  requiredMessages = {},
  preTests = {},
}) {
  return fields.reduce((validators, field) => {
    const requiredMessage = requiredMessages[field] || null;
    const preTest = preTests[field] || null;

    validators[field] = (value, allValues) => {
      // 1) required
      if (requiredMessage != null && (value === undefined || value === '')) {
        return requiredMessage;
      }
      // 2) pre-test (ex: basic regex for email)
      if (typeof preTest === 'function') {
        const msg = preTest(value, allValues);
        if (msg) return msg;
      }
      // 3) delegate to Yup
      try {
        schema.validateSyncAt(field, allValues);
        return '';
      } catch (err) {
        return err.message;
      }
    };

    return validators;
  }, {});
}
