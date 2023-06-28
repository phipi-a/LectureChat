"use client";

import { Box, Button, Dialog, Divider, Typography } from "@mui/material";
import React, { Suspense } from "react";
import { JoinRoomDialog } from "../joinRoom/JoinRoomDialog";
import { JoinedRoomsList } from "./JoinedRoomsList";
import { RoomsListFallback } from "../../general/RoomsListFallback";
import { MeetingRoom, MeetingRoomOutlined } from "@mui/icons-material";

export function StudentStartpage() {
  const [openJoinRoom, setOpenJoinRoom] = React.useState(false);
  return (
    <Box height={"100%"} flexDirection={"column"} display={"flex"} m={1}>
      <Box display={"flex"} alignItems={"center"}>
        <Typography variant={"h6"}>Recently Joined Rooms</Typography>
        <Box flexGrow={1} />
        <Button
          variant="outlined"
          color="primary"
          sx={{
            m: 1,
          }}
          onClick={() => {
            setOpenJoinRoom(true);
          }}
        >
          Join Room
          <MeetingRoomOutlined />
        </Button>
      </Box>

      <Divider variant="middle" />

      <Suspense fallback={<RoomsListFallback />}>
        <JoinedRoomsList />
      </Suspense>
      <Dialog
        open={openJoinRoom}
        onClose={() => setOpenJoinRoom(false)}
        maxWidth={"xs"}
        fullWidth
      >
        <JoinRoomDialog />
      </Dialog>
    </Box>
  );
}
