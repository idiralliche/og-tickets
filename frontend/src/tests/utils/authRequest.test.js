import { makeAuthPostRequest } from '../../utils/authRequest';

// Mock buildCSRFHeaders to always return a known header
jest.mock('../../utils/csrf', () => ({
  buildCSRFHeaders: jest.fn(() => ({ 'X-CSRFToken': 'test-token' })),
}));

/**
 * Test suite for the makeAuthPostRequest function.
 * @module MakeAuthPostRequestTests
 * @description Verifies the behavior of the makeAuthPostRequest function.
 */
describe('makeAuthPostRequest', () => {
  /**
   * Setup function to reset the global fetch mock before each test.
   */
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  /**
   * @test {makeAuthPostRequest} successful request
   * @description Verifies that makeAuthPostRequest adds a slash if missing and returns the JSON on 200 OK.
   */
  it('should add a slash if missing and return the JSON on 200 OK', async () => {
    // Mock a 200 response with JSON
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ foo: 'bar' }),
    });

    const result = await makeAuthPostRequest('login', { user: 'u' }, 'Login');
    expect(result).toEqual({ foo: 'bar' });

    // No longer checking the exact domain+port,
    // just that the URL ends correctly with /api/auth/login/
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/auth\/login\/$/),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ user: 'u' }),
      })
    );
  });

  /**
   * @test {makeAuthPostRequest} JSON parse error
   * @description Verifies that makeAuthPostRequest throws a generic error if the JSON does not parse.
   */
  it('should throw a generic error if the JSON does not parse', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockRejectedValue(new Error('invalid json')),
    });

    await expect(
      makeAuthPostRequest('login/', { user: 'u' }, 'Login')
    ).rejects.toThrow(/Login failed with status 500/);
  });

  /**
   * @test {makeAuthPostRequest} 204 No Content
   * @description Verifies that makeAuthPostRequest returns null for a 204 No Content status.
   */
  it('should return null for a 204 No Content status', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 204,
      json: jest.fn(), // will not be called
    });

    await expect(
      makeAuthPostRequest('logout/', {}, 'Logout')
    ).resolves.toBeNull();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/auth\/logout\/$/),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });
});
