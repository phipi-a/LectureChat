"use client";
import EditRoomDialog from "@/common/Components/EditRoomDialog";
import RoomAvatar from "@/common/Components/RoomAvatar";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { supabase } from "@/common/Modules/SupabaseClient";
import { timeConverter } from "@/utils/helper";
import { useGetData } from "@/utils/supabase/supabaseData";
import {
  CampaignOutlined,
  EditOutlined,
  MicOutlined,
  OndemandVideoOutlined,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Dialog,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";

export function HostedRoomsList() {
  const { userId } = useContext(AuthContext);
  const [openEditRoom, setOpenEditRoom] = React.useState(false);
  const [selectedRoomId, setSelectedRoomId] = React.useState("");
  const [selectedRoomTitle, setSelectedRoomTitle] = React.useState("");
  const [selectedRoomPassword, setSelectedRoomPassword] = React.useState("");

  const rooms = useGetData(
    ["host_rooms", userId],
    supabase
      .from("room")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
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
        <Box
          key={room.id}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <ListItemButton
            onClick={(e) => {
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
            <IconButton disabled>
              {room.is_video_room ? <OndemandVideoOutlined /> : <MicOutlined />}
            </IconButton>
          </ListItemButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();

              setOpenEditRoom(true);
              setSelectedRoomId(room.id);
              setSelectedRoomTitle(room.title);
              setSelectedRoomPassword(room.password);
              e.stopPropagation();
            }}
          >
            <EditOutlined />
          </IconButton>
        </Box>
      ))}
      {rooms.data?.data?.length! === 0 && (
        <Box textAlign={"center"} my={3}>
          <Typography color={"text.disabled"}>
            Creating your first room!
          </Typography>
          <CampaignOutlined color="disabled" fontSize="large" />
        </Box>
      )}
      <Dialog
        open={openEditRoom}
        onClose={() => setOpenEditRoom(false)}
        maxWidth={"xs"}
        fullWidth
      >
        <EditRoomDialog
          onClose={() => setOpenEditRoom(false)}
          room_id={selectedRoomId}
          room_title={selectedRoomTitle}
          room_password={selectedRoomPassword}
        />
      </Dialog>
    </Container>
  );
}
