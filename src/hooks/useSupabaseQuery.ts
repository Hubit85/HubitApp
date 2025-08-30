
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

interface UseSupabaseQueryOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  dependencies: any[] = [],
  options: UseSupabaseQueryOptions = {}
) {
  const { enabled = true, refetchOnMount = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<PostgrestError | null>(null);

  const refetch = async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      
      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(result.data);
      }
    } catch (err) {
      setError(err as PostgrestError);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && (refetchOnMount || dependencies.length > 0)) {
      refetch();
    }
  }, [enabled, refetchOnMount, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
