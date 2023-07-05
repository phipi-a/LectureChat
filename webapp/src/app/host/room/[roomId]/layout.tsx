import CheckAuth from "@/common/Components/CheckAuth";
import { RoomProvider } from "@/common/Contexts/RoomContext/RoomProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CheckAuth>
      <RoomProvider>{children}</RoomProvider>
    </CheckAuth>
  );
}
