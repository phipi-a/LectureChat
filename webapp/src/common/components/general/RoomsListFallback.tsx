"use client";
import {
  Avatar,
  Container,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { SchoolOutlined } from "@mui/icons-material";
import React from "react";
export function RoomsListFallback() {
  return (
    <Container
      maxWidth="md"
      sx={{
        overflow: "auto",
        flex: 1,
      }}
    >
      <ListItemButton>
        <ListItemAvatar>
          <Avatar>
            <SchoolOutlined />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
      </ListItemButton>
    </Container>
  );
}
