import CheckAuth from "@/common/modules/auth/CheckAuth";
import { RoomProvider } from "@/common/context/RoomProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CheckAuth>
      <RoomProvider>{children}</RoomProvider>
    </CheckAuth>
  );
}
