"use client";
import RoomAvatar from "@/common/Components/RoomAvatar";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { timeConverter } from "@/utils/helper";
import { useGetData } from "@/utils/supabase/supabaseData";
import { MicOutlined, OndemandVideoOutlined } from "@mui/icons-material";
import {
  Container,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { supabase } from "../../../Modules/SupabaseClient";

export function JoinedRoomsList() {
  const { userId } = useContext(AuthContext);
  const room_access = useGetData(
    ["student_rooms", userId],
    supabase.from("room_access").select("*"),
    {
      suspense: true,
    }
  );

  const router = useOwnRouter();
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
            {room.room_is_video_room ? (
              <OndemandVideoOutlined />
            ) : (
              <MicOutlined />
            )}
          </ListItemButton>
        ))}
      </Container>
    </>
  );
}
