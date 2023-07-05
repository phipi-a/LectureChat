"use client";

import {
  Settings,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { HostRoomSettingsDialog } from "./HostRoomSettingsDialog";

export function HostRoomHeader({
  title,
  roomId,
  password,
  whisperUrl,
  setWhisperUrl,
}: {
  title: string;
  roomId: string;
  password: string;
  whisperUrl: string;
  setWhisperUrl: (value: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"} mb={4}>
      <Typography variant={"h4"} flex={1}>
        {title} ({roomId})
      </Typography>
      <Typography
        variant="body1"
        sx={{
          display: showPassword ? "block" : "none",
          mr: 2,
        }}
      >
        Password: {password}
      </Typography>
      <Typography
        sx={{
          display: showPassword ? "none" : "block",
          mr: 2,
        }}
        whiteSpace={"nowrap"}
        variant="body1"
      >
        Password: {"• ".repeat(password.length!)}
      </Typography>

      <IconButton
        size="small"
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        <VisibilityOffOutlined
          fontSize="small"
          sx={{
            display: showPassword ? "block" : "none",
          }}
        />

        <VisibilityOutlined
          fontSize="small"
          sx={{
            display: showPassword ? "none" : "block",
          }}
        />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => {
          setOpenSettingsDialog(true);
        }}
      >
        <Settings />
      </IconButton>
      <HostRoomSettingsDialog
        openSettingsDialog={openSettingsDialog}
        setOpenSettingsDialog={setOpenSettingsDialog}
        whisperUrl={whisperUrl}
        setWhisperUrl={setWhisperUrl}
      />
    </Box>
  );
}
