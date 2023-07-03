"use client";
import { Box, Button, Toolbar as Tb, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useQueryClient } from "react-query";
import { AuthContext } from "../../context/AuthProvider";
import { supabase } from "../../modules/supabase/supabaseClient";
export function OwnToolbar() {
  const router = useRouter();
  const onTitleClick = () => {
    router.push("/");
  };
  const { loggedIn } = useContext(AuthContext);
  const queryClient = useQueryClient();
  return (
    <Tb>
      <Typography
        whiteSpace={"pre-line"}
        variant="h5"
        color={"primary"}
        letterSpacing={0}
        fontFamily={"monospace"}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            component={"span"}
            color={"primary"}
            fontFamily={"monospace"}
            fontWeight={"bold"}
          >
            <Box component="span" color={"text.primary"}>
              Lecture
            </Box>
            Chat
          </Box>
        </Link>
      </Typography>
      <Button
        sx={{
          marginLeft: "auto",
          display: loggedIn ? "block" : "none",
        }}
        onClick={() => {
          supabase.auth.signOut().then(() => {});
          queryClient.invalidateQueries();
        }}
      >
        Sign out
      </Button>
      <Button
        sx={{
          marginLeft: "auto",
          display: loggedIn ? "none" : "block",
        }}
        onClick={() => {
          router.push("/signin");
        }}
      >
        Sign in
      </Button>
    </Tb>
  );
}
