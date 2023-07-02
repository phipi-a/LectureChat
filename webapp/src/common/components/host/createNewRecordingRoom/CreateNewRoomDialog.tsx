import {
  useInsertData,
  useInsertSelectData,
} from "@/lib/utils/supabase/supabaseData";
import { LoadingButton } from "@mui/lab";
import {
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../../modules/supabase/supabaseClient";
import { AuthContext } from "../../../context/AuthProvider";
import { DropPdfFileBox } from "./DropPdfFileBox";
import { DropVideoFileBox } from "./DropVideoFileBox";
import { ConstructionSharp } from "@mui/icons-material";
interface Segment {
  start: number;
  end: number;
  text: string;
}

export function CreateNewRoomDialog({}) {
  const [nameHelperText, setNameHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState(Math.random().toString().substring(2, 8));
  const [isVideoRoom, setIsVideoRoom] = useState(false);
  const [idHelperText, setIdHelperText] = useState("");
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const transcriptionRef = useRef<Segment[]>([]);
  const { userId } = useContext(AuthContext);
  const roomId = useRef("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const uploadPdfFile = useMutation(
    async ({ file, roomId }: { file: any; roomId: string }) => {
      return await supabase.storage.from("pdf").upload(roomId + ".pdf", file, {
        contentType: "application/pdf",
        upsert: true,
      });
    },
    {
      onSuccess: (data: any) => {
        if (data.error) {
          enqueueSnackbar(data.error.message, {
            variant: "error",
          });
          return;
        }

        enqueueSnackbar("File uploaded", {
          variant: "success",
        });
        router.push(`/host/room/${roomId.current}`);
      },
    }
  );
  const whisperUrl = "http://localhost:9000";

  const transcriptVideo = useMutation(
    (audioBlob: Blob) => {
      const url = whisperUrl + "/asr?&output=json&language=en&";

      const formData = new FormData();
      formData.append("audio_file", audioBlob);

      return fetch(url, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
    {
      onSuccess: (data: any) => {
        transcriptionRef.current = data.segments;
        createVideoRoom.mutate({
          title: title,
          password: password,
          id: id,
          user_id: userId!,
          is_video_room: isVideoRoom,
        });
      },
    }
  );
  const uploadVideoTranscript = useInsertData(supabase.from("data"), {
    onSuccess(data) {
      if (data.error) {
        enqueueSnackbar("Error uploading transcript!", {
          variant: "error",
        });
      } else {
        queryClient.invalidateQueries(["host_rooms"]);
        router.push(`/host/room/${roomId.current}`);
      }
    },
  });

  const createAudioRoom = useInsertSelectData(supabase.from("room"), {
    onSuccess(data) {
      if (data.error) {
        if (data.error.message.includes("unique_user_id_name")) {
          setNameHelperText("Room name already in use!");
        } else {
          enqueueSnackbar("Error creating room!", {
            variant: "error",
          });
        }
      } else {
        queryClient.invalidateQueries(["host_rooms"]);

        uploadPdfFile.mutate({ file: pdfFile, roomId: data.data[0].id });
      }
    },
  });
  const createVideoRoom = useInsertSelectData(supabase.from("room"), {
    onSuccess(data) {
      if (data.error) {
        if (data.error.message.includes("unique_user_id_name")) {
          setNameHelperText("Room name already in use!");
        } else {
          enqueueSnackbar("Error creating room!", {
            variant: "error",
          });
        }
      } else {
        queryClient.invalidateQueries(["host_rooms"]);
        const segments = transcriptionRef.current.map((segment: Segment) => {
          return {
            data: segment.text,
            room_id: roomId.current,
            video_start_ms: segment.start,
            video_end_ms: segment.end,
          };
        });
        uploadVideoTranscript.mutate(segments);
      }
    },
  });

  function handleSubmit(event: any) {
    event.preventDefault();
    setNameHelperText("");
    setPasswordHelperText("");
    if (title.length < 6) {
      setNameHelperText("Room name must be at least 6 characters long");
      return;
    }
    if (password.length < 8) {
      setPasswordHelperText("Password must be at least 8 characters long");
      return;
    }
    if (id.length != 6) {
      setIdHelperText("Room id must be 6 characters long");
      return;
    }
    roomId.current = id;
    if (isVideoRoom) {
      const videoBlob = new Blob([videoFile], { type: "video/webm" });
      transcriptVideo.mutate(videoBlob);
      return;
    }
    createAudioRoom.mutate({
      title: title,
      password: password,
      user_id: userId!,
      id: id,
    });
  }
  return (
    <>
      <DialogTitle>{"Create Room"}</DialogTitle>
      <DialogContent>
        <Container maxWidth={"sm"}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Join Room
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              variant="standard"
              fullWidth
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Room Title"
              name="title"
              error={nameHelperText !== ""}
              helperText={nameHelperText}
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              variant="standard"
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordHelperText !== ""}
              helperText={passwordHelperText}
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              variant="standard"
              value={id}
              onChange={(e) => setId(e.target.value)}
              name="public id"
              label="id"
              type="id"
              id="id"
              error={idHelperText !== ""}
              helperText={idHelperText}
              autoComplete="current-id"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isVideoRoom}
                  onChange={(e) => setIsVideoRoom(e.target.checked)}
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              }
              label="VideoRoom"
            />
            {isVideoRoom ? (
              <Box display={"flex"} flexDirection={"row"}>
                <DropVideoFileBox
                  onFileChanged={(file) => {
                    setVideoFile(file);
                  }}
                />
              </Box>
            ) : (
              <DropPdfFileBox
                onFileChanged={(file) => {
                  setPdfFile(file);
                }}
              />
            )}

            <LoadingButton
              loading={createAudioRoom.isLoading || uploadPdfFile.isLoading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isVideoRoom && videoFile !== null
                ? "Create and Transcode Video"
                : "Create Room"}
            </LoadingButton>
            <LinearProgress variant="determinate" value={20} />
          </Box>
        </Container>
      </DialogContent>
    </>
  );
}
