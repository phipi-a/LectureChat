"use client";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "../../../modules/supabase/supabaseClient";
import { timeConverter } from "@/lib/utils/helper";
import { SchoolOutlined } from "@mui/icons-material";
import {
  Typography,
  Container,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/common/context/AuthProvider";
import { useContext } from "react";
import { RoomAvatar } from "../../general/RoomAvatar";

export function HostedRoomsList() {
  const { userId } = useContext(AuthContext);
  const rooms = useGetData(
    ["host_rooms", userId],
    supabase.from("room").select("*").order("created_at", { ascending: false })
  );
  const router = useRouter();

  return (
    <Container
      maxWidth="md"
      sx={{
        overflow: "auto",
        maxHeight: "400px",
        flex: 1,
      }}
    >
      {rooms.data?.data?.map((room) => (
        <ListItemButton
          key={room.id}
          onClick={() => {
            router.push(`/host/room/${room.id}`);
          }}
        >
          <ListItemAvatar>
            <RoomAvatar roomTitle={room.title} />
          </ListItemAvatar>
          <ListItemText
            primary={<Typography noWrap>{room.title}</Typography>}
            secondary={
              <Typography noWrap variant="body2" color={"text.secondary"}>
                {timeConverter(room.created_at!)}
              </Typography>
            }
          />
        </ListItemButton>
      ))}
    </Container>
  );
}
