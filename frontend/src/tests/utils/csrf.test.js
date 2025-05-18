import { getCSRFToken, buildCSRFHeaders } from '../../utils/csrf';

/**
 * Test suite for CSRF token utilities
 * @module CSRFUtilsTests
 * @description Tests the CSRF token retrieval and header building utilities
 */
describe('getCSRFToken', () => {
  /**
   * @function beforeEach
   * @description Resets document.cookie before each test to ensure clean test state
   */
  beforeEach(() => {
    // Reset document.cookie before each test
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  /**
   * @test {getCSRFToken}
   * @description Verifies that null is returned when no CSRF token cookie exists
   */
  it('returns null if no csrftoken cookie is present', () => {
    expect(getCSRFToken()).toBeNull();
  });

  /**
   * @test {getCSRFToken}
   * @description Verifies correct token extraction when CSRF token exists among other cookies
   */
  it('returns the value of the csrftoken cookie when present among other cookies', () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'foo=bar; csrftoken=abc123; baz=qux',
    });
    expect(getCSRFToken()).toBe('abc123');
  });

  /**
   * @test {getCSRFToken}
   * @description Verifies proper URL decoding of the CSRF token value
   */
  it('correctly decodes the token (decodeURIComponent)', () => {
    const encoded = 'a%20b%3Dc';
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: `csrftoken=${encoded}`,
    });
    expect(getCSRFToken()).toBe('a b=c');
  });

  /**
   * @test {getCSRFToken}
   * @description Verifies handling of cookie string without trailing semicolon
   */
  it('handles the cookie without a trailing semicolon', () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'csrftoken=xyz',
    });
    expect(getCSRFToken()).toBe('xyz');
  });
});

/**
 * Test suite for CSRF header builder
 * @module CSRFHeaderTests
 * @description Tests the building of request headers with CSRF token
 */
describe('buildCSRFHeaders', () => {
  /**
   * @function beforeEach
   * @description Resets document.cookie before each test to ensure clean test state
   */
  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  /**
   * @test {buildCSRFHeaders}
   * @description Verifies default headers are used when no arguments provided
   */
  it('uses default headers if no arguments are provided', () => {
    const result = buildCSRFHeaders();
    expect(result).toEqual({
      'Content-Type': 'application/json',
    });
  });

  /**
   * @test {buildCSRFHeaders}
   * @description Verifies X-CSRFToken is not added when CSRF cookie is absent
   */
  it('does not add X-CSRFToken if the cookie is absent', () => {
    const initial = { 'Content-Type': 'application/json' };
    expect(buildCSRFHeaders({ ...initial })).toEqual(initial);
  });

  /**
   * @test {buildCSRFHeaders}
   * @description Verifies X-CSRFToken is added when CSRF cookie exists
   */
  it('adds X-CSRFToken when the token exists', () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'csrftoken=mytoken',
    });
    const initial = { 'Content-Type': 'application/json' };
    expect(buildCSRFHeaders({ ...initial })).toEqual({
      'Content-Type': 'application/json',
      'X-CSRFToken': 'mytoken',
    });
  });

  /**
   * @test {buildCSRFHeaders}
   * @description Verifies custom headers are preserved when building CSRF headers
   */
  it('takes custom headers as input into account', () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'csrftoken=tok123',
    });
    const custom = { Accept: 'application/json' };
    expect(buildCSRFHeaders({ ...custom })).toEqual({
      Accept: 'application/json',
      'X-CSRFToken': 'tok123',
    });
  });
});
