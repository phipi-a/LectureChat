"use client";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { LoadingContext } from "@/common/Contexts/LoadingContext/LoadingContext";
import { Box, Button, Toolbar as Tb, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useTransition } from "react";
import { useQueryClient } from "react-query";
import { supabase } from "../../Modules/SupabaseClient";
export function OwnToolbar() {
  const router = useRouter();
  const { loggedIn } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { loading, setLoading } = useContext(LoadingContext);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  console.log(isPending);
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
          startTransition(() => router.push("/signin"));
        }}
      >
        Sign in
      </Button>
    </Tb>
  );
}
