"use client";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { Box, Button, Toolbar as Tb, Typography } from "@mui/material";
import { useContext } from "react";
import { useQueryClient } from "react-query";
import { supabase } from "../../Modules/SupabaseClient";
import Link from "../Link";
export function OwnToolbar() {
  const { loggedIn } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const router = useOwnRouter();

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
