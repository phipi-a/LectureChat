"use client";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "../../../modules/supabase/supabaseClient";
import { timeConverter } from "@/lib/utils/helper";
import { SchoolOutlined } from "@mui/icons-material";
import {
  Container,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import Room from "@/app/host/room/[roomId]/page";
import { RoomAvatar } from "@/common/components/general/RoomAvatar";

export function JoinedRoomsList() {
  const { userId } = useContext(AuthContext);
  const room_access = useGetData(
    ["student_rooms", userId],
    supabase.from("room_access").select("*"),
    {
      suspense: true,
    }
  );
  console.log(room_access);
  const router = useRouter();
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          overflow: "auto",
          flex: 1,
        }}
      >
        {room_access.data?.data?.map((room) => (
          <ListItemButton
            key={room.room_id}
            onClick={() => {
              router.push(`/student/room/${room.room_id}`);
            }}
          >
            <ListItemAvatar>
              <RoomAvatar roomTitle={room.room_title!} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography noWrap>{room.room_title}</Typography>}
              secondary={
                <Typography noWrap variant="body2" color={"text.secondary"}>
                  {timeConverter(room.created_at!)}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </Container>
    </>
  );
}
