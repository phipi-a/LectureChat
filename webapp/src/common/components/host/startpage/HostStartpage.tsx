"use client";

import { PaperBox } from "@/common/elements/PaperBox";
import { AddOutlined } from "@mui/icons-material";
import { Button, Dialog } from "@mui/material";
import React, { Suspense } from "react";
import { RoomsListFallback } from "../../general/RoomsListFallback";
import { CreateNewRoomDialog } from "../createNewRecordingRoom/CreateNewRoomDialog";
import { HostedRoomsList } from "./HostedRoomsList";

export function HostStartpage() {
  const [openCreateRoom, setOpenCreateRoom] = React.useState(false);
  return (
    <PaperBox
      title={"Your Hosted Rooms"}
      button={
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
      }
    >
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
    </PaperBox>
  );
}
