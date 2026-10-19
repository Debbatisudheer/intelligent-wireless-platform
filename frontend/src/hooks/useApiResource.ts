import { useCallback, useEffect, useState } from "react";

import type { ApiResponse } from "../types/api";

interface ApiResourceState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

interface UseApiResourceResult<T> extends ApiResourceState<T> {
  refresh: () => Promise<void>;
}

export function useApiResource<T>(
  request: () => Promise<ApiResponse<T>>,
): UseApiResourceResult<T> {
  const [state, setState] =
    useState<ApiResourceState<T>>({
      data: [],
      loading: true,
      error: null,
    });

  const refresh = useCallback(async () => {
    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    try {
      const response = await request();

      setState({
        data: response.data ?? [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load data.",
      });
    }
  }, [request]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}