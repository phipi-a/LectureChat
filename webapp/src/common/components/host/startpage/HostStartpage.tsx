"use client";

import { Box, Button, Dialog, Divider, Typography } from "@mui/material";
import { HostedRoomsList } from "./HostedRoomsList";
import { CreateNewRoomDialog } from "../createNewRoom/CreateNewRoomDialog";
import React, { Suspense } from "react";
import { RoomsListFallback } from "../../general/RoomsListFallback";
import { AddOutlined } from "@mui/icons-material";

export function HostStartpage() {
  const [openCreateRoom, setOpenCreateRoom] = React.useState(false);
  return (
    <Box height={"100%"} flexDirection={"column"} display={"flex"} m={1}>
      <Box display={"flex"} alignItems={"center"}>
        <Typography variant={"h6"}>Your Hosted Rooms</Typography>
        <Box flexGrow={1} />
        <Button
          variant="outlined"
          color="primary"
          sx={{
            m: 1,
          }}
          onClick={() => {
            setOpenCreateRoom(true);
          }}
        >
          Create Room
          <AddOutlined />
        </Button>
      </Box>

      <Divider variant="middle" />

      <Suspense fallback={<RoomsListFallback />}>
        <HostedRoomsList />
      </Suspense>
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
