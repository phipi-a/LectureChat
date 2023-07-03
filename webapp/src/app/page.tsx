"use client";
import { HostStartpage } from "@/common/components/host/startpage/HostStartpage";
import { PersonalizeStartPage } from "@/common/components/personalize/PersonalizeStartPage";
import { StudentStartpage } from "@/common/components/student/startpage/StudentStartpage";
import { AuthContext } from "@/common/context/AuthProvider";
import { AppLogo } from "@/common/elements/AppLogo";
import { startPageText } from "@/common/text/startpage";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Home() {
  const router = useRouter();
  const { loggedIn, event } = useContext(AuthContext);
  if (event === "PASSWORD_RECOVERY") {
    return router.replace("/update-password");
  }
  if (loggedIn) {
    return (
      <Container>
        <Box
          display={"flex"}
          flexDirection={"column"}
          sx={{
            my: 2,
          }}
        >
          <Typography
            variant={"h4"}
            fontFamily={"monospace"}
            fontWeight={"bold"}
          >
            Hey 👋
          </Typography>
          <Typography
            whiteSpace={"pre-line"}
            variant="h6"
            color={"primary"}
            letterSpacing={0}
            fontFamily={"monospace"}
          >
            <Box component={"span"} color={"text.primary"}>
              Welcome to{" "}
            </Box>
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
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={{
            xs: "column",
            md: "row-reverse",
          }}
        >
          <Box flex={1}>
            <HostStartpage />
          </Box>
          <Box flex={1}>
            <StudentStartpage />
            <PersonalizeStartPage />
          </Box>
        </Box>
      </Container>
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
          <AppLogo />

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
