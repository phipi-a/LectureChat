"use client";

import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";

export function HostRoomHeader({
  title,
  roomId,
  password,
}: {
  title: string;
  roomId: string;
  password: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      mb={4}
      flexWrap={"wrap"}
    >
      <Typography
        variant="h4"
        display={{
          xs: "none",
          sm: "block",
        }}
        flex={1}
      >
        {title} ({roomId})
      </Typography>
      <Typography
        variant="h5"
        display={{
          xs: "block",
          sm: "none",
        }}
        flex={1}
      >
        {title} ({roomId})
      </Typography>
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <Typography
          variant="body1"
          sx={{
            display: showPassword ? "block" : "none",
            mr: 2,
          }}
        >
          Password:{" "}
          <span
            style={{
              fontFamily: "monospace",
              letterSpacing: 0,
            }}
          >
            {password}
          </span>
        </Typography>
        <Typography
          sx={{
            display: showPassword ? "none" : "block",
            mr: 2,
          }}
          whiteSpace={"nowrap"}
          variant="body1"
        >
          Password:{" "}
          <span
            style={{
              fontFamily: "monospace",
              letterSpacing: 0,
            }}
          >
            {"•".repeat(password.length!)}
          </span>
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
      </Box>
    </Box>
  );
}
