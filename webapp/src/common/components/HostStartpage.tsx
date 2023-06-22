"use client";

import { Box, Button, Dialog } from "@mui/material";
import { HostedRoomsList } from "./HostedRoomsList";
import { CreateNewRoomDialog } from "./CreateNewRoomDialog";
import React from "react";

export function HostStartpage() {
  const [openCreateRoom, setOpenCreateRoom] = React.useState(false);
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
          setOpenCreateRoom(true);
        }}
      >
        Create Room
      </Button>
      <HostedRoomsList />
      <Dialog
        open={openCreateRoom}
        onClose={() => setOpenCreateRoom(false)}
        maxWidth={"lg"}
        fullWidth
      >
        <CreateNewRoomDialog />
      </Dialog>
    </Box>
  );
}
