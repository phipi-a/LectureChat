"use client";

import { CheckOutlined, DeleteOutline, PlayArrow } from "@mui/icons-material";
import { Box, IconButton, Popover, Stack, TextField } from "@mui/material";

export function TranscriptionEditPopover({
  editText,
  setEditText,
  videoMode = false,
  onGoTOVideoClick = () => {},
  anchorEl,
  handleClose,
  onTextConfirm,
  onTextDelete,
}: {
  editText: string;
  setEditText: (text: string) => void;
  anchorEl: HTMLButtonElement | null;
  videoMode: boolean;
  onGoTOVideoClick: () => void;
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
          {videoMode && (
            <IconButton
              aria-label="go to video"
              component="span"
              onClick={() => {
                onGoTOVideoClick();
              }}
            >
              <PlayArrow color="primary" />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Popover>
  );
}
