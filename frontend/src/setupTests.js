/**
 * Test environment setup file that:
 * 1. Imports jest-dom for React Testing Library assertions
 * 2. Polyfills TextEncoder/TextDecoder for Jest/JSDom environment
 *
 * @module testSetup
 * @description This configuration file ensures proper test environment setup by:
 * - Adding custom DOM assertions via @testing-library/jest-dom
 * - Providing TextEncoder/TextDecoder implementations when missing in global scope
 *
 * @example
 * // This file is automatically loaded before tests via Jest config
 * // No need to import manually in test files
 *
 * @see {@link https://github.com/testing-library/jest-dom} for available matchers
 * @see {@link https://nodejs.org/api/util.html#util_class_util_textencoder} for TextEncoder docs
 */
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
