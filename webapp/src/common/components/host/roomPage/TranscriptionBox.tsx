"use client";

import {
  DeleteOutline,
  CloseFullscreenOutlined,
  CheckOutlined,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  Popover,
  TextField,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { DeleteAllDataDialog } from "./DeleteAllDataDialog";
import { TranscriptionEditPopover } from "./TranscriptionEditPopover";

export function TranscriptionBox({
  editable = false,
  rawData,
  updateDataItem,
  deleteDataItem,
  deleteAllData,
  transcriptBoxOpen,
  setTranscriptBoxOpen,
}: {
  editable?: boolean;

  rawData: any[];
  updateDataItem: (item: any) => void;
  deleteDataItem: (item: any) => void;
  deleteAllData: () => void;
  transcriptBoxOpen: boolean;
  setTranscriptBoxOpen: (open: boolean) => void;
}) {
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = React.useState(false);
  const [editText, setEditText] = React.useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (editable) {
      setAnchorEl(event.currentTarget);
      setEditText(rawData.find((d) => d.id === event.currentTarget.id).data);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          flex: 1,
          textAlign: "left",
        }}
      >
        <Box
          justifyContent={"end"}
          display={transcriptBoxOpen ? "flex" : "none"}
        >
          {editable && (
            <IconButton
              size={"small"}
              color="error"
              onClick={() => {
                setOpenDeleteAllDialog(true);
              }}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size={"small"}
            onClick={() => {
              setTranscriptBoxOpen(false);
            }}
          >
            <CloseFullscreenOutlined fontSize="small" />
          </IconButton>
        </Box>
        <table
          style={{
            width: "100%",
            tableLayout: "fixed",
          }}
        >
          <tbody>
            <tr>
              <td>
                <Typography
                  variant="body1"
                  color={"text.secondary"}
                  sx={{
                    direction: "rtl",
                    overflow: "hidden",
                    maxWidth: "100%",
                    tableLayout: "fixed",
                    textAlign: "left",
                    whiteSpace: transcriptBoxOpen ? "normal" : "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  whiteSpace={"nowrap"}
                  textOverflow={"ellipsis"}
                >
                  {rawData
                    .sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
                    .map((d) => (
                      <span
                        key={d.id + d.data}
                        id={d.id}
                        className="text_select"
                        onClick={transcriptBoxOpen ? handleClick : undefined}
                        style={{
                          backgroundColor:
                            anchorEl?.id === d.id ? "#1565c0" : "",
                          borderRadius: "5px",
                        }}
                      >
                        {d.data}
                        &lrm;
                      </span>
                    ))}
                  <TranscriptionEditPopover
                    editText={editText}
                    setEditText={setEditText}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    onTextConfirm={function (text: string): void {
                      const item = rawData.find((d) => d.id === anchorEl?.id);
                      item.data = editText;
                      updateDataItem(item);
                      handleClose();
                    }}
                    onTextDelete={function (): void {
                      const item = rawData.find((d) => d.id === anchorEl?.id);
                      deleteDataItem(item);
                      handleClose();
                    }}
                  />
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
      <DeleteAllDataDialog
        openDeleteAllDialog={openDeleteAllDialog}
        setOpenDeleteAllDialog={setOpenDeleteAllDialog}
        deleteAllData={deleteAllData}
      />
    </Box>
  );
}
