"use client";
import { supabase } from "@/common/Modules/SupabaseClient";
import { validateEmail } from "@/utils/helper";
import {
  useAuthSendPasswordResetEmail,
  useAuthSignInWithPassword,
  useAuthSignUpWithPassword,
} from "@/utils/supabase/supabaseAuth";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Box,
  Collapse,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [emailHelperText, setEmailHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [lastLoginPassword, setLastLoginPassword] = useState("");
  const [lastLoginEmail, setLastLoginEmail] = useState("");
  const emailRef = useRef<any>(null);

  const resetPassword = useAuthSendPasswordResetEmail(
    supabase.auth,
    enqueueSnackbar,
    {
      onSuccess(data) {
        enqueueSnackbar("Password reset email sent!", {
          variant: "success",
        });
        //("/signin", { replace: true, state: state });
      },
    }
  );
  const handleForgotPassword = (event: any) => {
    const email = emailRef.current.value;

    setEmailHelperText("");
    if (email.length === 0) {
      setEmailHelperText("Email cannot be empty");
      return;
    }
    if (!validateEmail(email)) {
      setEmailHelperText("Invalid email");
      return;
    }
    resetPassword.mutate(email);
  };

  const sendVerificationMail = useAuthSignUpWithPassword(
    supabase.auth,
    enqueueSnackbar,
    {
      onSuccess(data) {
        setEmailVerificationSent(true);
        setEmailNotVerified(false);
      },
    }
  );

  const loginAccount = useAuthSignInWithPassword(
    supabase.auth,
    enqueueSnackbar,
    {
      onSuccess(data) {
        if (data.error) {
          if (data.error.message === "Invalid login credentials") {
            setEmailHelperText("Invalid email or password");
            setPasswordHelperText("Invalid email or password");
          }
          if (data.error.message === "Email not confirmed") {
            setEmailNotVerified(true);
          }
          return;
        }

        if (data.data.session != null) {
          if (data.data.session.user.email_confirmed_at == null) {
            setEmailNotVerified(true);
          } else {
            router.replace("/");
          }
        } else {
          enqueueSnackbar("no Auth user found!", {
            variant: "error",
          });
        }
      },
    }
  );

  function onLogin(email: string, password: string) {
    supabase.auth.signOut();
    setLastLoginEmail(email);
    setLastLoginPassword(password);
    loginAccount.mutate({
      email: email,
      password: password,
    });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    event.preventDefault();
    setEmailVerificationSent(false);
    setEmailNotVerified(false);
    setPasswordHelperText("");
    setEmailHelperText("");
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

    onLogin(email, password);
  };

  function onResendVerificationEmail() {
    sendVerificationMail.mutate({
      email: lastLoginEmail,
      password: lastLoginPassword,
    });
    //wait 2 seconds
  }
  return (
    <main>
      <Container maxWidth={"sm"}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            inputRef={emailRef}
            label="Email Address"
            name="email"
            error={emailHelperText !== ""}
            helperText={emailHelperText}
            autoFocus
            tabIndex={1}
          />
          <Typography variant="body2" color="text.secondary" align="right">
            {"Forgot your password? "}
            <LoadingButton
              onClick={handleForgotPassword}
              tabIndex={5}
              variant="text"
              loading={resetPassword.isLoading}
              sx={{ textTransform: "none" }}
            >
              {"Reset password"}
            </LoadingButton>
          </Typography>
          <TextField
            margin="normal"
            required
            tabIndex={2}
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            error={passwordHelperText !== ""}
            helperText={passwordHelperText}
            autoComplete="current-password"
          />

          <Collapse in={emailNotVerified}>
            <Alert severity="error">
              <AlertTitle>
                Please verify your email!{" "}
                <LoadingButton
                  onClick={onResendVerificationEmail}
                  variant="text"
                  loading={sendVerificationMail.isLoading}
                >
                  Resend
                </LoadingButton>
              </AlertTitle>
              <strong>
                Verification email sent! pls check your email and login again!
              </strong>
            </Alert>
          </Collapse>
          <Collapse in={emailVerificationSent}>
            <Alert severity="success">
              <AlertTitle>
                Verification email sent! pls check your email and login again!
              </AlertTitle>
            </Alert>
          </Collapse>

          <LoadingButton
            loading={loginAccount.isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </LoadingButton>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          {"Don't have an account? "}
          <Link href="/signup" tabIndex={4}>
            {"Sign Up"}
          </Link>
        </Typography>
      </Container>
    </main>
  );
}
