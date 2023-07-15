"use client";
import CheckAuth from "@/common/Components/CheckAuth";
import { RoomProvider } from "@/common/Contexts/RoomContext/RoomProvider";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { roomId: string };
}) {
  if (params.roomId === "000000") {
    return <RoomProvider>{children}</RoomProvider>;
  }
  return (
    <CheckAuth>
      <RoomProvider>{children}</RoomProvider>
    </CheckAuth>
  );
}
