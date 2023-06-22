import CheckAuth from "@/common/modules/auth/CheckAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CheckAuth>{children}</CheckAuth>;
}
