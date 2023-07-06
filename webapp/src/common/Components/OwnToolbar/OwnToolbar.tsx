"use client";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { Settings } from "@mui/icons-material";
import { Box, Button, Dialog, Toolbar as Tb, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useQueryClient } from "react-query";
import Link from "../Link";
import { SettingsDialog } from "./SettingsDialog";
export function OwnToolbar() {
  const { loggedIn, session } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [openSettings, setOpenSettings] = React.useState(false);

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
      <Box sx={{ flexGrow: 1 }} />

      <Button
        sx={{
          display: loggedIn ? "block" : "none",
        }}
        onClick={() => {
          setOpenSettings(true);
        }}
      >
        <Box flexWrap={"nowrap"} flexDirection={"row"} display={"flex"}>
          <Typography marginX={2}>{session?.user?.email}</Typography>
          <Settings />
        </Box>
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
      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        fullWidth
      >
        <SettingsDialog
          closeDialog={() => {
            setOpenSettings(false);
          }}
        />
      </Dialog>
    </Tb>
  );
}
