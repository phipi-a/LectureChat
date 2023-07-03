"use client";

import {
  DeleteOutline,
  InsertDriveFileOutlined,
  NoteAddOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export function DropPdfFileBox({
  onFileChanged,
  disabled,
}: {
  onFileChanged: (file: any) => void;
  disabled?: boolean;
}) {
  const [file, setFile] = useState<any>(null);
  const onDrop = useCallback((acceptedFiles: any) => {
    if (disabled) {
      return;
    }
    if (acceptedFiles.length > 1) {
      //snackbar
      enqueueSnackbar("Only one file is allowed", {
        variant: "error",
      });
      return;
    }
    if (acceptedFiles.length === 0) {
      //snackbar
      enqueueSnackbar("No file was uploaded", {
        variant: "error",
      });
      return;
    }
    if (acceptedFiles[0].type !== "application/pdf") {
      //snackbar
      enqueueSnackbar("Only PDF files are allowed", {
        variant: "error",
      });
      return;
    }
    setFile(acceptedFiles[0]);
    onFileChanged(acceptedFiles[0]);

    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Box
      sx={{
        width: "100px",
        border: "1px dashed ",
        padding: 1,
        ":hover": {
          color: "primary.main",
          borderColor: "primary.main",
        },
      }}
      borderRadius={5}
      color={isDragActive ? "primary.main" : "grey.500"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {file === null ? (
        <>
          <NoteAddOutlined
            sx={{
              fontSize: 70,
            }}
          />
          <Typography
            variant="body2"
            display={file ? "none" : "block"}
            textAlign={"center"}
            textOverflow={"ellipsis"}
          >
            Upload PDF
          </Typography>
        </>
      ) : (
        <>
          <InsertDriveFileOutlined
            display={file === null ? "block" : "none"}
            sx={{
              fontSize: 70,
            }}
          />

          <Typography
            variant="body2"
            display={file ? "block" : "none"}
            width={"100%"}
            noWrap
            textAlign={"center"}
            textOverflow={"ellipsis"}
          >
            {file?.name}
          </Typography>
          <IconButton
            color="error"
            onClick={(e) => {
              setFile(null);
              onFileChanged(null);
            }}
          >
            <DeleteOutline />
          </IconButton>
        </>
      )}
    </Box>
  );
}
