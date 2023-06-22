"use client";

import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";
import { create } from "domain";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { supabase } from "../modules/supabase/supabaseClient";
import CheckAuth from "../modules/auth/CheckAuth";

export function JoinRoomDialog() {
  const router = useRouter();
  const { userId } = useContext(AuthContext);
  const [passwordHelperText, setPasswordHelperText] = React.useState("");
  const [roomIdHelperText, setRoomIdHelperText] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const auth = supabase.auth;
    const data = new FormData(event.currentTarget);
    const roomId = data.get("roomId") as string;
    const password = data.get("password") as string;

    setPasswordHelperText("");
    setRoomIdHelperText("");
    if (roomId.length < 6) {
      setRoomIdHelperText("Room id must be at least 6 characters");
      return;
    }
    if (password.length < 8) {
      setPasswordHelperText("Password must be at least 8 characters");
      return;
    }

    supabase
      .from("room_access")
      .upsert({
        room_id: roomId,
        user_id: userId!,
        password: password,
      })
      .then((value) => {
        if (value.error) {
          console.log(value.error);
          if (value.error.message.includes("duplicate key")) {
            router.push(`/student/room/${roomId}`);
            return;
          }
          if (
            value.error.message.includes("invalid input") ||
            value.error.message.includes("security policy")
          ) {
            setPasswordHelperText("Invalid password or room id");
            setRoomIdHelperText("Invalid password or room id");
            return;
          }
        } else {
          router.push(`/student/room/${roomId}`);
        }
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Join
              </Button>
            </Box>
          </Container>
        </CheckAuth>
      </DialogContent>
    </>
  );
}
