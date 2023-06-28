"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export function HostRoomSettingsDialog({
  whisperUrl,
  setWhisperUrl,
  openSettingsDialog,
  setOpenSettingsDialog,
}: {
  whisperUrl: string;
  setWhisperUrl: (value: string) => void;
  openSettingsDialog: boolean;
  setOpenSettingsDialog: (value: boolean) => void;
}) {
  return (
    <Dialog
      open={openSettingsDialog}
      onClose={() => setOpenSettingsDialog(false)}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Whisper URL"
          value={whisperUrl}
          onChange={(e) => setWhisperUrl(e.target.value)}
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenSettingsDialog(false);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
