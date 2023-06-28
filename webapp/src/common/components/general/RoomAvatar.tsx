import { createAvatar } from "@dicebear/core";
import { Avatar } from "@mui/material";
import { SchoolOutlined } from "@mui/icons-material";
import React, { useMemo } from "react";
export function RoomAvatar({ roomTitle }: { roomTitle: string }) {
  const stringToColour = (str: string) => {
    let hash = 0;
    str.split("").forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, "0");
    }
    return colour;
  };

  return (
    <Avatar
      variant="rounded"
      sx={{
        bgcolor: stringToColour(roomTitle),
      }}
    >
      {roomTitle.at(0)}
    </Avatar>
  );
}
