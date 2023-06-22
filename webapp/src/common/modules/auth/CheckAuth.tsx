"use client";
import { AuthContext } from "@/common/context/AuthProvider";
import { redirect } from "next/navigation";
import { useContext } from "react";

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useContext(AuthContext);
  console.log("loggedIn", loggedIn);
  if (loggedIn === false) {
    redirect("/signin");
  }

  return <>{children}</>;
}
