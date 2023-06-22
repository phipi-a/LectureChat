"use client";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import { validateEmail } from "@/lib/utils/helper";
import { useAuthSignUpWithPassword } from "@/lib/utils/supabase/supabaseAuth";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React from "react";

export default function Home() {
  const [emailHelperText, setEmailHelperText] = React.useState("");
  const [passwordHelperText, setPasswordHelperText] = React.useState("");
  const router = useRouter();
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    React.useState("");
  const createAccount = useAuthSignUpWithPassword(
    supabase.auth,
    enqueueSnackbar,
    {
      onSuccess(data) {
        if (data.error) {
          console.log("erro", data);
        } else {
          if (data.data?.user?.identities?.length === 0) {
            setEmailHelperText("Email already in use!");
          } else {
            enqueueSnackbar("Verification email sent!", {
              variant: "success",
            });
            router.replace("/signin");
          }
        }
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;
    console.log(email, password);
    supabase.auth.signOut();
    event.preventDefault();
    setPasswordHelperText("");
    setEmailHelperText("");
    setConfirmPasswordHelperText("");
    console.log(email, password, confirmPassword);
    if (email.length === 0) {
      setEmailHelperText("Email cannot be empty");
      return;
    }
    if (!validateEmail(email)) {
      setEmailHelperText("Invalid email");
      return;
    }
    if (password.length === 0) {
      setPasswordHelperText("Password cannot be empty");
      return;
    }
    if (password.length < 8) {
      setPasswordHelperText("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      console.log(password);
      setPasswordHelperText("Passwords do not match");
      setConfirmPasswordHelperText("Passwords do not match");
      return;
    }
    createAccount.mutate({ email, password });
  };
  return (
    <main>
      <Container maxWidth={"sm"}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            helperText={emailHelperText}
            error={emailHelperText !== ""}
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
            loading={createAccount.isLoading}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
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
