"use client";
import React from "react";

import { LoadingContext } from "./LoadingContext";

export const LoadingProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  console.log("loading", loading);
  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
