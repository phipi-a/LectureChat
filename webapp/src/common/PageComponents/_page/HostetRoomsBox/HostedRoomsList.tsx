"use client";
import RoomAvatar from "@/common/Components/RoomAvatar";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { supabase } from "@/common/Modules/SupabaseClient";
import { timeConverter } from "@/utils/helper";
import { useGetData } from "@/utils/supabase/supabaseData";
import {
  CampaignOutlined,
  MicOutlined,
  OndemandVideoOutlined,
} from "@mui/icons-material";
import {
  Box,
  Container,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useContext } from "react";

export function HostedRoomsList() {
  const { userId } = useContext(AuthContext);
  const rooms = useGetData(
    ["host_rooms", userId],
    supabase.from("room").select("*").order("created_at", { ascending: false })
  );
  const router = useOwnRouter();

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
          {room.is_video_room ? <OndemandVideoOutlined /> : <MicOutlined />}
        </ListItemButton>
      ))}
      {rooms.data?.data?.length! === 0 && (
        <Box textAlign={"center"} my={3}>
          <Typography color={"text.disabled"}>
            Creating your first room!
          </Typography>
          <CampaignOutlined color="disabled" fontSize="large" />
        </Box>
      )}
    </Container>
  );
}
