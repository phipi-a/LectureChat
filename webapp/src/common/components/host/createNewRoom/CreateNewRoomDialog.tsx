import { useInsertSelectData } from "@/lib/utils/supabase/supabaseData";
import { LoadingButton } from "@mui/lab";
import {
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Container,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../../../modules/supabase/supabaseClient";
import { AuthContext } from "../../../context/AuthProvider";
import { DropPdfFileBox } from "./DropPdfFileBox";

export function CreateNewRoomDialog({}) {
  const [nameHelperText, setNameHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [idHelperText, setIdHelperText] = useState("");
  const [file, setFile] = useState<any>(null);
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
        console.log("router");
      },
    }
  );

  const createRoom = useInsertSelectData(supabase.from("room"), {
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
        uploadPdfFile.mutate({ file: file, roomId: data.data[0].id });
      }
    },
  });

  function handleSubmit(event: any) {
    event.preventDefault();
    const title = event.target.title.value;
    const password = event.target.password.value;
    const id = event.target.id.value;
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
    createRoom.mutate({
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
              error={passwordHelperText !== ""}
              helperText={passwordHelperText}
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              variant="standard"
              name="public id"
              label="id"
              type="id"
              id="id"
              error={idHelperText !== ""}
              helperText={idHelperText}
              autoComplete="current-id"
              defaultValue={Math.random().toString().substring(2, 8)}
            />

            <DropPdfFileBox
              roomId={""}
              onFileChanged={(file) => {
                setFile(file);
              }}
            />

            <LoadingButton
              loading={createRoom.isLoading || uploadPdfFile.isLoading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </LoadingButton>
          </Box>
        </Container>
      </DialogContent>
    </>
  );
}
