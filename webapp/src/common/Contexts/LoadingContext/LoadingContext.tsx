"use client";
import React from "react";

export const LoadingContext = React.createContext<{
  isPending: boolean;
  startTransition: (callback: () => void) => void;
}>({
  isPending: false,
  startTransition: () => {},
});
