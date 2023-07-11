import { supabase } from "@/common/Modules/SupabaseClient";
import { useDeleteData, useUpdateData } from "@/utils/supabase/supabaseData";
import { DeleteOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";
interface Segment {
  start: number;
  end: number;
  text: string;
}

export function EditRoomDialog({
  room_id,
  room_title,
  room_password,
  onClose,
}: {
  room_id: string;
  room_title: string;
  room_password: string;
  onClose: () => void;
}) {
  const [nameHelperText, setNameHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [title, setTitle] = useState(room_title);
  const [password, setPassword] = useState(room_password);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [showSaveRoomDialog, setShowSaveRoomDialog] = useState(false);

  const queryClient = useQueryClient();
  const deleteRoom = useDeleteData(supabase.from("room"), {
    onSuccess: (res) => {
      router.push("/");
      queryClient.invalidateQueries({
        queryKey: ["host_rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["host", "room", room_id],
      });
      queryClient.invalidateQueries([room_id]);
      queryClient.invalidateQueries(["bulletpoints", room_id]);
      onClose();
    },
  });

  const updateRoom = useUpdateData(supabase.from("room"), {
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["host_rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["host", "room", room_id],
      });
      queryClient.invalidateQueries([room_id]);
      queryClient.invalidateQueries(["bulletpoints", room_id]);
      onClose();
    },
  });
  const [showDeleteRoomDialog, setShowDeleteRoomDialog] = useState(false);

  function handleSubmit() {
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
    updateRoom.mutate({
      field: "id",
      value: room_id,
      data: {
        title: title,
        password: password,
      },
    });
  }
  const isLoading = updateRoom.isLoading || deleteRoom.isLoading;
  return (
    <>
      <DialogTitle>{"Edit Room"}</DialogTitle>
      <DialogContent>
        <Container maxWidth={"sm"}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Edit Room
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
              disabled={isLoading}
              variant="standard"
              fullWidth
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setNameHelperText("");
              }}
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
              disabled={isLoading}
              variant="standard"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordHelperText("");
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={passwordHelperText !== ""}
              helperText={passwordHelperText}
              autoComplete="current-password"
            />
            <Accordion
              sx={{
                backgroundColor: "transparent",
                borderRadius: "5px",
              }}
            >
              <AccordionSummary
                sx={{
                  color: "text.disabled",
                }}
              >
                Delete Room
              </AccordionSummary>
              <AccordionDetails>
                <LoadingButton
                  loading={isLoading}
                  variant="outlined"
                  color="error"
                  onClick={() => setShowDeleteRoomDialog(true)}
                >
                  Delete Room
                  <DeleteOutline />
                </LoadingButton>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ mt: 3, mb: 2 }}>
          Cancel
        </Button>
        <LoadingButton
          loading={isLoading}
          onClick={() => setShowSaveRoomDialog(true)}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </LoadingButton>
      </DialogActions>

      <Dialog
        open={showDeleteRoomDialog}
        onClose={() => setShowDeleteRoomDialog(false)}
      >
        <DialogTitle>Delete Room</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this room? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            sx={{ m: 1 }}
            color="error"
            onClick={() => {
              deleteRoom.mutate({ field: "id", value: room_id });
              setShowDeleteRoomDialog(false);
            }}
          >
            Delete Room
          </LoadingButton>
          <Button
            variant="outlined"
            sx={{ m: 1 }}
            onClick={() => setShowDeleteRoomDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showSaveRoomDialog}
        onClose={() => setShowSaveRoomDialog(false)}
      >
        <DialogTitle>Save</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to save this room? All joined users have to
            rejoin the room. And their bullet points and chats will be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            sx={{ m: 1 }}
            color="error"
            onClick={() => {
              handleSubmit();
              setShowSaveRoomDialog(false);
            }}
          >
            Save
          </LoadingButton>
          <Button
            variant="outlined"
            sx={{ m: 1 }}
            onClick={() => setShowSaveRoomDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
