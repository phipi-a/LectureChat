"use client";
import React, { useTransition } from "react";

import { LoadingContext } from "./LoadingContext";

export const LoadingProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isPending, startTransition] = useTransition();
  console.log("LoadingProvider", isPending);
  return (
    <LoadingContext.Provider
      value={{
        isPending,
        startTransition,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
