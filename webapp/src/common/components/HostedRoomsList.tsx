"use client";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "../modules/supabase/supabaseClient";
import { timeConverter } from "@/lib/utils/helper";
import { AddOutlined, SchoolOutlined } from "@mui/icons-material";
import {
  Typography,
  Divider,
  Container,
  Button,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

export function HostedRoomsList() {
  const rooms = useGetData(
    ["host", "rooms"],
    supabase.from("room").select("*")
  );
  const router = useRouter();

  return (
    <Container
      maxWidth="md"
      sx={{
        overflow: "auto",
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
            <Avatar>
              <SchoolOutlined />
            </Avatar>
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
