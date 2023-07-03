"use client";
import { AuthContext } from "@/common/context/AuthProvider";
import { redirect } from "next/navigation";
import { useContext } from "react";

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useContext(AuthContext);

  if (loggedIn === false) {
    redirect("/signin");
  }

  return <>{children}</>;
}
