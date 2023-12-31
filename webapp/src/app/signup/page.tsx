"use client";
import Link from "@/common/Components/Link";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { supabase } from "@/common/Modules/SupabaseClient";
import { validateEmail } from "@/utils/helper";
import { useAuthSignUpWithPassword } from "@/utils/supabase/supabaseAuth";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React from "react";

export default function Home() {
  const [emailHelperText, setEmailHelperText] = React.useState("");
  const [passwordHelperText, setPasswordHelperText] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [privacyHelperText, setPrivacyHelperText] = React.useState("");
  const router = useOwnRouter();
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    React.useState("");
  const createAccount = useAuthSignUpWithPassword(
    supabase.auth,
    enqueueSnackbar,
    {
      onSuccess(data) {
        if (data.error) {
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

    supabase.auth.signOut();
    event.preventDefault();
    setPasswordHelperText("");
    setEmailHelperText("");
    setPrivacyHelperText("");
    setConfirmPasswordHelperText("");

    if (!checked) {
      setPrivacyHelperText("Please accept the privacy policy");
    }

    if (email.length === 0) {
      setEmailHelperText("Email cannot be empty");
    }
    if (!validateEmail(email)) {
      setEmailHelperText("Invalid email");
    }
    if (password.length === 0) {
      setPasswordHelperText("Password cannot be empty");
    }
    if (password.length < 8) {
      setPasswordHelperText("Password must be at least 8 characters");
    }
    if (password !== confirmPassword) {
      setPasswordHelperText("Passwords do not match");
      setConfirmPasswordHelperText("Passwords do not match");
    }
    if (
      !checked ||
      email.length === 0 ||
      password.length === 0 ||
      password.length < 8 ||
      password !== confirmPassword ||
      !validateEmail(email)
    ) {
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
          <FormControl required>
            <FormControlLabel
              required
              label={
                <Typography variant="body2" color="text.secondary">
                  {"I read and agree to the "}
                  <a href="/terms" target="_blank" rel="noreferrer">
                    {"Privacy Policy"}
                  </a>
                </Typography>
              }
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => {
                    setChecked(event.target.checked);
                  }}
                  name="terms"
                />
              }
            />

            <FormHelperText error={privacyHelperText !== ""}>
              {privacyHelperText}
            </FormHelperText>
          </FormControl>

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
