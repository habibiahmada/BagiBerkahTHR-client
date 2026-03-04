import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { Envelope } from '@/lib/types';

/**
 * Custom hook untuk manage envelope data
 */
export function useEnvelope(envelopeId: string | null) {
  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!envelopeId) return;

    const fetchEnvelope = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await api.getEnvelope(envelopeId) as Envelope;
        setEnvelope(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch envelope');
      } finally {
        setLoading(false);
      }
    };

    fetchEnvelope();
  }, [envelopeId]);

  const refetch = async () => {
    if (!envelopeId) return;

    setLoading(true);
    try {
      const data = await api.getEnvelope(envelopeId) as Envelope;
      setEnvelope(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch envelope');
    } finally {
      setLoading(false);
    }
  };

  return { envelope, loading, error, refetch };
}

/**
 * Custom hook untuk create envelope
 */
export function useCreateEnvelope() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEnvelope = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.createEnvelope(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create envelope';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createEnvelope, loading, error };
}
