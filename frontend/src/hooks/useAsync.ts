import { useCallback, useEffect, useRef, useState } from "react";

import type { AsyncState } from "../types/ui";

interface UseAsyncOptions {
  immediate?: boolean;
}

interface UseAsyncResult<T> extends AsyncState<T> {
  execute: () => Promise<T | null>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {},
): UseAsyncResult<T> {
  const { immediate = true } = options;

  const mountedRef = useRef(true);

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: immediate ? "loading" : "idle",
    error: null,
  });

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (): Promise<T | null> => {
    if (mountedRef.current) {
      setState({
        data: null,
        status: "loading",
        error: null,
      });
    }

    try {
      const result = await asyncFunction();

      if (mountedRef.current) {
        setState({
          data: result,
          status: "success",
          error: null,
        });
      }

      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      if (mountedRef.current) {
        setState({
          data: null,
          status: "error",
          error: message,
        });
      }

      return null;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      void execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }

    setState({
      data: null,
      status: "idle",
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}