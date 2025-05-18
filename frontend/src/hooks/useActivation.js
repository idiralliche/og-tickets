import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { activateAccount } from '../services/activationService';

/**
 * Custom hook for handling account activation flow.
 *
 * @function
 * @returns {string} Current activation status: 'pending' | 'success' | 'error'
 *
 * @example
 * const activationStatus = useActivation();
 *
 * @description
 * Handles the complete account activation process:
 * 1. Extracts uid and token from URL search parameters
 * 2. Validates the presence of required parameters
 * 3. Makes API call to activate account
 * 4. Updates status accordingly
 *
 * Status transitions:
 * - Starts as 'pending'
 * - On success: 'success'
 * - On missing params or API failure: 'error'
 *
 * Note: Designed to work with activation links containing uid and token parameters.
 */
export function useActivation() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('pending'); // 'pending' | 'success' | 'error'

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    if (!uid || !token) {
      setStatus('error');
      return;
    }

    (async () => {
      try {
        await activateAccount(uid, token);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    })();
  }, [searchParams]);

  return status;
}
