"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export function DeleteAllDataDialog({
  openDeleteAllDialog,
  setOpenDeleteAllDialog,
  deleteAllData,
}: {
  openDeleteAllDialog: boolean;
  setOpenDeleteAllDialog: (open: boolean) => void;
  deleteAllData: () => void;
}) {
  return (
    <Dialog
      open={openDeleteAllDialog}
      onClose={() => setOpenDeleteAllDialog(false)}
    >
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete all the data?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenDeleteAllDialog(false);
          }}
        >
          Cancel
        </Button>
        <Button
          color="error"
          onClick={() => {
            setOpenDeleteAllDialog(false);
            deleteAllData();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
