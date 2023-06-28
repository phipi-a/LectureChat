"use client";

import { CheckOutlined, DeleteOutline } from "@mui/icons-material";
import { Popover, Box, TextField, Stack, IconButton } from "@mui/material";
import React from "react";

export function TranscriptionEditPopover({
  editText,
  setEditText,
  anchorEl,
  handleClose,
  onTextConfirm,
  onTextDelete,
}: {
  editText: string;
  setEditText: (text: string) => void;
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
  onTextConfirm: (text: string) => void;
  onTextDelete: () => void;
}) {
  return (
    <Popover
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          m: 2,
        }}
        alignItems={"center"}
        flex={1}
      >
        <TextField
          fullWidth
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          variant="standard"
          multiline
        />
        <Stack direction="row" spacing={1} sx={{ mx: 1 }}>
          <IconButton
            aria-label="upload"
            component="span"
            onClick={() => {
              onTextConfirm(editText);
            }}
          >
            <CheckOutlined color="success" />
          </IconButton>
          <IconButton
            aria-label="delete"
            component="span"
            onClick={() => {
              onTextDelete();
            }}
          >
            <DeleteOutline color="error" />
          </IconButton>
        </Stack>
      </Box>
    </Popover>
  );
}
