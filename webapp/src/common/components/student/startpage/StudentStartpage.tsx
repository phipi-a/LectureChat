"use client";

import { PaperBox } from "@/common/elements/PaperBox";
import { MeetingRoomOutlined } from "@mui/icons-material";
import { Button, Dialog } from "@mui/material";
import React, { Suspense } from "react";
import { RoomsListFallback } from "../../general/RoomsListFallback";
import { JoinRoomDialog } from "../joinRoom/JoinRoomDialog";
import { JoinedRoomsList } from "./JoinedRoomsList";

export function StudentStartpage() {
  const [openJoinRoom, setOpenJoinRoom] = React.useState(false);
  return (
    <PaperBox
      title={"Recently Joined Rooms"}
      button={
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
      }
    >
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
    </PaperBox>
  );
}
