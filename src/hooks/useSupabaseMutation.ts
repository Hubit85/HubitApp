
import { useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";

interface MutationOptions<T, R> {
  onSuccess?: (data: R) => void;
  onError?: (error: PostgrestError) => void;
}

export function useSupabaseMutation<T = any, R = any>(
  mutationFn: (variables: T) => Promise<{ data: R | null; error: PostgrestError | null }>,
  options: MutationOptions<T, R> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [data, setData] = useState<R | null>(null);

  const mutate = async (variables: T) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      
      if (result.error) {
        setError(result.error);
        options.onError?.(result.error);
      } else {
        setData(result.data);
        options.onSuccess?.(result.data!);
      }
      
      return result;
    } catch (err) {
      const error = err as PostgrestError;
      setError(error);
      options.onError?.(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    },
  };
}
