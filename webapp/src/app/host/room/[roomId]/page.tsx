"use client";
import Image from "next/image";
import styles from "./page.module.css";

import { useContext, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "./page.css";
import {
  useDeleteData,
  useGetData,
  useInsertData,
  useInsertSelectData,
  useUpsertData,
} from "@/lib/utils/supabase/supabaseData";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import React from "react";
import { useMutation } from "react-query";
import { AudioRecorder } from "@/common/components/AudioRecorder";
import {
  CheckOutlined,
  CloseFullscreenOutlined,
  DeleteOutline,
  MicExternalOnOutlined,
  MicNone,
  MicNoneOutlined,
  MicOff,
  MicOutlined,
  MinimizeOutlined,
  Upload,
  Visibility,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

export default function Room({ params }: { params: { roomId: string } }) {
  const [editText, setEditText] = React.useState<string>("");
  const data = React.useRef("");
  const [text, setText] = React.useState<string>("");
  const textRef = React.useRef(text);
  const [microphoneActive, setMicrophoneActive] =
    React.useState<boolean>(false);
  const [rawData, setRawData] = React.useState<any[]>([]);
  const getRoom = useGetData(
    ["host", "room", params.roomId],
    supabase.from("room").select("*").eq("id", params.roomId).single()
  );
  const getInitData = useGetData(
    ["host", "room", params.roomId, "initData"],
    supabase.from("data").select("*").eq("room_id", params.roomId),
    {
      onSuccess: (data) => {
        if (data.data) {
          setRawData(data.data);
          textRef.current = data.data
            .map((d: { data: any }) => d.data)
            .join(" ");
          setText(textRef.current);
        }
      },
    }
  );
  const [recordingState, setRecordingState] = React.useState<
    "recording" | "stoped"
  >("stoped");

  const mutation = useMutation({
    mutationFn: (audioBlob: Blob) => {
      const url = "http://192.168.178.20:9000/asr?&output=json&language=en&";

      const formData = new FormData();
      formData.append("audio_file", audioBlob);

      return fetch(url, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (data.text.length > 0) {
        textRef.current += data.text;
        setText(textRef.current);
        insertData.mutate({
          room_id: params.roomId,
          data: data.text,
        });
      }
    },
  });
  const { stopAudioRecording, startAudioRecording } = AudioRecorder({
    newAudioBlobCallback: (blob) => {
      mutation.mutate(blob);
    },
    recordingStateCallback: (state) => {
      setRecordingState(state);
    },
    longPauseCallback: () => {},
  });

  const insertData = useInsertSelectData(
    supabase.from("data"),

    {
      onSuccess: (data) => {
        rawData.push(data.data![0]);
        setRawData(rawData);
        console.log("rawData", rawData);
      },
    }
  );

  const upsertData = useUpsertData(supabase.from("data"));
  const deleteData = useDeleteData(supabase.from("data"));

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setEditText(rawData.find((d) => d.id === event.currentTarget.id).data);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [editTranscriptOpen, setEditTranscriptOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  console.log(editTranscriptOpen);
  if (getRoom.isLoading || getInitData.isLoading) {
    return <div>Loading...</div>;
  }
  const open = Boolean(anchorEl);
  return (
    <div>
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"} mb={4}>
        <Typography variant={"h4"} flex={1}>
          {getRoom.data?.data?.title} ({params.roomId})
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: showPassword ? "block" : "none",
            mr: 2,
          }}
        >
          Password: {getRoom.data?.data?.password}
        </Typography>
        <Typography
          sx={{
            display: showPassword ? "none" : "block",
            mr: 2,
          }}
          whiteSpace={"nowrap"}
          variant="body1"
        >
          Password: {"• ".repeat(getRoom.data?.data?.password.length!)}
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
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={editTranscriptOpen ? "flex-start" : "center"}
      >
        <IconButton
          onClick={
            microphoneActive
              ? () => {
                  setMicrophoneActive(false);
                  stopAudioRecording();
                }
              : () => {
                  setMicrophoneActive(true);
                  startAudioRecording();
                }
          }
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress
              sx={{
                visibility:
                  mutation.isLoading || insertData.isLoading
                    ? "visible"
                    : "hidden",
              }}
            />
            <MicOutlined
              sx={{
                position: "absolute",
                display: microphoneActive ? "block" : "none",
              }}
              color={recordingState === "recording" ? "primary" : "inherit"}
            />
            <MicOff
              color={"error"}
              sx={{
                position: "absolute",
                display: microphoneActive ? "none" : "block",
              }}
            />
          </Box>
        </IconButton>

        <Box
          sx={{
            border: "3px solid",
            borderColor: "primary.main",
            borderRadius: "5px",
            overflow: "hidden",
            display: "flex",
            p: 2,
          }}
          flex={1}
          onClick={
            editTranscriptOpen ? undefined : () => setEditTranscriptOpen(true)
          }
        >
          <Collapse in={editTranscriptOpen} collapsedSize={"2em"}>
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
                  display={editTranscriptOpen ? "flex" : "none"}
                >
                  <IconButton
                    size={"small"}
                    color="error"
                    onClick={() => {
                      setOpenDeleteAllDialog(true);
                    }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                  <IconButton
                    size={"small"}
                    onClick={() => {
                      setEditTranscriptOpen(false);
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
                            whiteSpace: editTranscriptOpen
                              ? "normal"
                              : "nowrap",
                            textOverflow: "ellipsis",
                          }}
                          whiteSpace={"nowrap"}
                          textOverflow={"ellipsis"}
                        >
                          {rawData
                            .sort((a, b) =>
                              a.created_at > b.created_at ? 1 : -1
                            )
                            .map((d) => (
                              <span
                                key={d.id + d.data}
                                id={d.id}
                                className="text_select"
                                onClick={
                                  editTranscriptOpen ? handleClick : undefined
                                }
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
                          <Popover
                            anchorOrigin={{
                              vertical: "center",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "center",
                              horizontal: "center",
                            }}
                            open={open}
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
                                    const item = rawData.find(
                                      (d) => d.id === anchorEl?.id
                                    );
                                    item.data = editText;
                                    setRawData([...rawData]);
                                    upsertData.mutate(item);
                                    handleClose();
                                  }}
                                >
                                  <CheckOutlined color="success" />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  component="span"
                                  onClick={() => {
                                    const item = rawData.find(
                                      (d) => d.id === anchorEl?.id
                                    );
                                    deleteData.mutate({
                                      field: "id",
                                      value: item.id,
                                    });
                                    setRawData([
                                      ...rawData.filter(
                                        (d) => d.id !== item.id
                                      ),
                                    ]);
                                    handleClose();
                                  }}
                                >
                                  <DeleteOutline color="error" />
                                </IconButton>
                              </Stack>
                            </Box>
                          </Popover>
                        </Typography>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Box>
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
              deleteData.mutate({
                field: "room_id",
                value: params.roomId,
              });
              setRawData([]);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
