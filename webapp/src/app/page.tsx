"use client";
import { CreateNewRoomDialog } from "@/common/components/CreateNewRoomDialog";
import { HostStartpage } from "@/common/components/HostStartpage";
import { HostedRoomsList } from "@/common/components/HostedRoomsList";
import { JoinRoomDialog } from "@/common/components/JoinRoomDialog";
import { JoinedRoomsList } from "@/common/components/JoinedRoomsList";
import { StudentStartpage } from "@/common/components/StudentStartpage";
import { AuthContext } from "@/common/context/AuthProvider";
import CheckAuth from "@/common/modules/auth/CheckAuth";
import { startPageText } from "@/common/text/startpage";
import { useLocalStorage } from "@/lib/utils/helper";

import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Container,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { create } from "domain";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useContext } from "react";

export default function Home() {
  const [openJoinRoom, setOpenJoinRoom] = React.useState(false);
  const router = useRouter();
  const { loggedIn, event } = useContext(AuthContext);
  if (event === "PASSWORD_RECOVERY") {
    return router.replace("/update-password");
  }
  if (loggedIn) {
    return (
      <Box
        flex={1}
        overflow={"auto"}
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Box
          maxHeight={"50%"}
          overflow={"auto"}
          width={{ xs: "100%", md: "50%" }}
        >
          <StudentStartpage />
        </Box>
        <Box overflow={"auto"} flex={1} width={{ xs: "100%", md: "50%" }}>
          <HostStartpage />
        </Box>
      </Box>
    );
  } else {
    return (
      <Container>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          sx={{
            my: 10,
          }}
        >
          <Typography
            variant={"h3"}
            color={"primary"}
            fontFamily={"monospace"}
            fontWeight={"bold"}
          >
            <Box component="span" color={"text.primary"}>
              Lecture
            </Box>
            Chat
          </Typography>

          <Typography
            whiteSpace={"pre-line"}
            textAlign={"center"}
            variant="h6"
            color={"text.secondary"}
            letterSpacing={0.5}
            fontFamily={"monospace"}
          >
            {startPageText}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
            }}
            onClick={() => {
              router.push("/signup");
            }}
          >
            Try It for Free
          </Button>
        </Box>
      </Container>
    );
  }
}
