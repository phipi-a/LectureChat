import { RoomProvider } from "@/common/context/RoomProvider";
import CheckAuth from "@/common/modules/auth/CheckAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CheckAuth>
      <RoomProvider>{children}</RoomProvider>
    </CheckAuth>
  );
}
