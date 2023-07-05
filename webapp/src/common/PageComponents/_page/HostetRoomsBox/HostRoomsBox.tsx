"use client";

import PaperBox from "@/common/Components/PaperBox";
import RoomsListFallback from "@/common/Components/RoomsListFallback";
import { AddOutlined } from "@mui/icons-material";
import { Button, Dialog } from "@mui/material";
import React, { Suspense } from "react";
import { CreateNewRoomDialog } from "./CreateNewRoomDialog";
import { HostedRoomsList } from "./HostedRoomsList";

export function HostedRoomsBox() {
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
