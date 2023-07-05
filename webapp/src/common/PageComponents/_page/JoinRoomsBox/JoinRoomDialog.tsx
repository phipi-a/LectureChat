"use client";

import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { useUpsertData } from "@/utils/supabase/supabaseData";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Container,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useQueryClient } from "react-query";
import CheckAuth from "../../../Components/CheckAuth/CheckAuth";
import { supabase } from "../../../Modules/SupabaseClient";

export function JoinRoomDialog() {
  const router = useOwnRouter();
  const { userId } = useContext(AuthContext);
  const [passwordHelperText, setPasswordHelperText] = React.useState("");
  const [roomIdHelperText, setRoomIdHelperText] = React.useState("");
  const roomId = React.useRef("");
  const queryClient = useQueryClient();
  const joinRoom = useUpsertData(supabase.from("room_access"), {
    onSuccess: (value) => {
      if (value.error) {
        if (value.error.message.includes("duplicate key")) {
          router.push(`/student/room/${roomId.current}`);
          return;
        }
        if (value.error.message.includes("password")) {
          setPasswordHelperText("Invalid password or room id");
          setRoomIdHelperText("Invalid password or room id");
          return;
        }
      } else {
        queryClient.invalidateQueries("student_rooms");
        router.push(`/student/room/${roomId.current}`);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const roomId_new = data.get("roomId") as string;
    const password = data.get("password") as string;

    setPasswordHelperText("");
    setRoomIdHelperText("");
    if (roomId_new.length < 6) {
      setRoomIdHelperText("Room id must be at least 6 characters");
      return;
    }
    if (password.length < 8) {
      setPasswordHelperText("Password must be at least 8 characters");
      return;
    }
    roomId.current = roomId_new;
    joinRoom.mutate({
      room_id: roomId_new,
      user_id: userId!,
      password: password,
      room_title: "",
    });
  };
  return (
    <>
      <DialogTitle>{"Join Room"}</DialogTitle>
      <DialogContent>
        <CheckAuth>
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
                fullWidth
                id="roomId"
                label="Room ID"
                name="roomId"
                helperText={roomIdHelperText}
                error={roomIdHelperText !== ""}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                helperText={passwordHelperText}
                error={passwordHelperText !== ""}
                autoComplete="current-password"
              />
              <LoadingButton
                loading={joinRoom.isLoading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Join
              </LoadingButton>
            </Box>
          </Container>
        </CheckAuth>
      </DialogContent>
    </>
  );
}
