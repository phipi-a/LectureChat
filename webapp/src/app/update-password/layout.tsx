"use client";
import CheckAuth from "@/common/Components/CheckAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CheckAuth>{children}</CheckAuth>;
}
