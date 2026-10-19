import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface DashboardContextValue {
  refreshVersion: number;
  requestRefresh: () => void;
}

const DashboardContext =
  createContext<DashboardContextValue | undefined>(
    undefined,
  );

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({
  children,
}: DashboardProviderProps) {
  const [refreshVersion, setRefreshVersion] = useState(0);

  const requestRefresh = useCallback(() => {
    setRefreshVersion((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({
      refreshVersion,
      requestRefresh,
    }),
    [refreshVersion, requestRefresh],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext(): DashboardContextValue {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboardContext must be used inside DashboardProvider",
    );
  }

  return context;
}