"use client";
import RoomAvatar from "@/common/Components/RoomAvatar";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { timeConverter } from "@/utils/helper";
import { useDeleteData, useGetData } from "@/utils/supabase/supabaseData";
import {
  AssignmentTurnedInOutlined,
  LogoutOutlined,
  MicOutlined,
  OndemandVideoOutlined,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useQueryClient } from "react-query";
import { supabase } from "../../../Modules/SupabaseClient";

export function JoinedRoomsList() {
  const [openLeftRoom, setOpenLeftRoom] = React.useState(false);
  const [selectedRoomId, setSelectedRoomId] = React.useState("");
  const [selectedRoomTitle, setSelectedRoomTitle] = React.useState("");
  const { userId } = useContext(AuthContext);
  const room_access = useGetData(
    ["student_rooms", userId],
    supabase.from("room_access").select("*"),
    {
      suspense: true,
    }
  );
  const queryClient = useQueryClient();

  const mutation = useDeleteData(supabase.from("room_access"), {
    onSuccess: () => {
      setOpenLeftRoom(false);
      queryClient.invalidateQueries(["student_rooms", userId]);
      queryClient.invalidateQueries([selectedRoomId]);
      queryClient.invalidateQueries(["bulletpoints", selectedRoomId]);
    },
  });
  const isLoading = mutation.isLoading;

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
          <Box
            key={room.id}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
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
              <IconButton disabled>
                {room.room_is_video_room ? (
                  <OndemandVideoOutlined />
                ) : (
                  <MicOutlined />
                )}
              </IconButton>
            </ListItemButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setOpenLeftRoom(true);
                setSelectedRoomId(room.id);
                setSelectedRoomTitle(room.room_title!);
                e.stopPropagation();
              }}
            >
              <LogoutOutlined />
            </IconButton>
          </Box>
        ))}
        {room_access.data?.data?.length! === 0 && (
          <Box textAlign={"center"} my={3}>
            <Typography color={"text.disabled"}>
              Join a room created by your teacher!
            </Typography>
            <AssignmentTurnedInOutlined color="disabled" fontSize="large" />
          </Box>
        )}
        <Dialog open={openLeftRoom} onClose={() => setOpenLeftRoom(false)}>
          <DialogTitle>Leave {selectedRoomTitle}?</DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to leave {selectedRoomTitle}? All your
              bullet points and chats will be deleted.
            </Typography>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={isLoading}
              variant="outlined"
              sx={{ m: 1 }}
              color="error"
              onClick={() => {
                mutation.mutate({
                  field: "id",
                  value: selectedRoomId,
                });
              }}
            >
              Leave
            </LoadingButton>
            <Button
              variant="outlined"
              sx={{ m: 1 }}
              onClick={() => setOpenLeftRoom(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
