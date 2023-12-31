"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { LoadingContext } from "../Contexts/LoadingContext/LoadingContext";

export function useOwnRouter() {
  const { isPending, startTransition } = useContext(LoadingContext);
  const router = useRouter();
  const back = () => {
    startTransition(() => {
      router.back();
    });
  };
  const push = (url: string) => {
    startTransition(() => {
      router.push(url);
    });
  };
  const replace = (url: string) => {
    startTransition(() => {
      router.replace(url);
    });
  };
  return { push: push, replace: replace, back: back };
}
