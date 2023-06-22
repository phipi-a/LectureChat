import {
  useInsertData,
  useInsertSelectData,
} from "@/lib/utils/supabase/supabaseData";
import { LoadingButton } from "@mui/lab";
import { DialogTitle, DialogContent, Box, TextField } from "@mui/material";
import { create } from "domain";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { supabase } from "../modules/supabase/supabaseClient";
import { AuthContext } from "../context/AuthProvider";

export function CreateNewRoomDialog({}) {
  const queryClient = useQueryClient();
  const [nameHelperText, setNameHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const { userId } = useContext(AuthContext);
  const router = useRouter();
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
        queryClient.invalidateQueries(["host", "rooms"]);
        router.push(`/host/room/${data.data[0].id}`);
      }
    },
  });

  function handleSubmit(event: any) {
    event.preventDefault();
    const name = event.target.name.value;
    const password = event.target.password.value;
    setNameHelperText("");
    setPasswordHelperText("");
    if (name.length < 6) {
      setNameHelperText("Room name must be at least 6 characters long");
      return;
    }
    if (password.length < 8) {
      setPasswordHelperText("Password must be at least 8 characters long");
      return;
    }
    createRoom.mutate({
      name: name,
      password: password,
      user_id: userId!,
    });
  }
  return (
    <>
      <DialogTitle>{"Create Room"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            variant="standard"
            fullWidth
            id="name"
            label="Room Name"
            name="name"
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
          <LoadingButton
            loading={createRoom.isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </LoadingButton>
        </Box>
      </DialogContent>
    </>
  );
}
