"use client";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import { useAuthUpdatePassword } from "@/lib/utils/supabase/supabaseAuth";
import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React from "react";

export default function Home() {
  const [passwordHelperText, setPasswordHelperText] = React.useState("");
  const router = useRouter();
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    React.useState("");

  const updatePassword = useAuthUpdatePassword(supabase.auth, enqueueSnackbar, {
    onSuccess: () => {
      enqueueSnackbar("Password updated!", {
        variant: "success",
      });
      supabase.auth.signOut();
      router.replace("/signin");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;
    supabase.auth.signOut();
    event.preventDefault();
    setPasswordHelperText("");
    setConfirmPasswordHelperText("");

    if (password.length === 0) {
      setPasswordHelperText("Password cannot be empty");
      return;
    }
    if (password.length < 8) {
      setPasswordHelperText("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordHelperText("Passwords do not match");
      setConfirmPasswordHelperText("Passwords do not match");
      return;
    }
    updatePassword.mutate(password);
  };
  return (
    <main>
      <Container maxWidth={"sm"}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Update Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            helperText={passwordHelperText}
            error={passwordHelperText !== ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            helperText={confirmPasswordHelperText}
            error={confirmPasswordHelperText !== ""}
          />
          <LoadingButton
            type="submit"
            loading={updatePassword.isLoading}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Password
          </LoadingButton>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          {"Already have an account? "}
          <Link href="/signin">{"Sign In"}</Link>
        </Typography>
      </Container>
    </main>
  );
}
