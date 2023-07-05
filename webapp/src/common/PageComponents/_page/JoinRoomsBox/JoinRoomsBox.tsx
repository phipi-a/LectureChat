"use client";

import PaperBox from "@/common/Components/PaperBox";
import { MeetingRoomOutlined } from "@mui/icons-material";
import { Button, Dialog } from "@mui/material";
import React, { Suspense } from "react";
import { RoomsListFallback } from "../../../Components/RoomsListFallback/RoomsListFallback";
import { JoinRoomDialog } from "./JoinRoomDialog";
import { JoinedRoomsList } from "./JoinedRoomsList";

export function JoinRoomsBox() {
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
