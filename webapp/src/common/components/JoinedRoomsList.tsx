"use client";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "../modules/supabase/supabaseClient";
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

export function JoinedRoomsList() {
  const room_access = useGetData(
    ["student", "rooms"],
    supabase.from("room_access").select("*")
  );
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
              <Avatar>
                <SchoolOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography noWrap>{room.id}</Typography>}
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
