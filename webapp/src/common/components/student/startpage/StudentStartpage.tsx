"use client";

import { Box, Button, Dialog } from "@mui/material";
import React from "react";
import { JoinRoomDialog } from "../joinRoom/JoinRoomDialog";
import { JoinedRoomsList } from "./JoinedRoomsList";

export function StudentStartpage() {
  const [openJoinRoom, setOpenJoinRoom] = React.useState(false);
  return (
    <Box
      height={"100%"}
      alignItems={"center"}
      flexDirection={"column"}
      display={"flex"}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{
          m: 1,
        }}
        onClick={() => {
          setOpenJoinRoom(true);
        }}
      >
        Join Room
      </Button>
      <JoinedRoomsList />
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
