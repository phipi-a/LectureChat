import React from "react";

export const LoadingContext = React.createContext<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
}>({
  loading: false,
  setLoading: () => {},
});
