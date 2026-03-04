import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { ClaimData } from '@/lib/types';

/**
 * Custom hook untuk manage claim data
 */
export function useClaim(token: string | null) {
  const [claim, setClaim] = useState<ClaimData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchClaim = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await api.getClaim(token) as ClaimData;
        setClaim(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch claim');
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [token]);

  const submitClaim = async (data: any) => {
    if (!token) throw new Error('No token provided');

    setLoading(true);
    setError(null);

    try {
      const result = await api.submitClaim(token, data) as ClaimData;
      setClaim(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit claim';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { claim, loading, error, submitClaim };
}

/**
 * Custom hook untuk validate QR
 */
export function useQRValidation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateQR = async (qrToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.validateQR(qrToken);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate QR';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { validateQR, loading, error };
}
