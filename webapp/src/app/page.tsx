"use client";

import AppLogo from "@/common/Components/AppLogo";
import PaperBox from "@/common/Components/PaperBox";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import HostedRoomsBox from "@/common/PageComponents/_page/HostetRoomsBox";
import JoinRoomsBox from "@/common/PageComponents/_page/JoinRoomsBox";
import PersonalizeBox from "@/common/PageComponents/_page/PersonalizeBox";
import { startPageText } from "@/common/Texts/startpage";
import { useUserData } from "@/utils/supabase/supabaseQuery";
import { Masonry } from "@mui/lab";
import { Box, Button, Container, Typography } from "@mui/material";
import { useContext } from "react";
import { useQueryClient } from "react-query";

export default function Home() {
  const router = useOwnRouter();
  const { loggedIn, event, userId } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const [userData] = useUserData(userId, queryClient);

  //console.log(useTest);

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
        <Masonry
          columns={{
            xs: 1,
            md: 2,
          }}
          spacing={{
            xs: 2,
            md: 3,
          }}
          style={{
            margin: "0",
          }}
        >
          {userData.data?.data?.openai_key === "" && (
            <PaperBox title={"No OpenAI API Key"} warning>
              <Typography variant="body1" color={"text.secondary"} m={2}>
                You have not set an OpenAI API key yet. You can do this in the
                settings. Without an API key, you cannot use the chatbot or
                generate notes.
              </Typography>
            </PaperBox>
          )}
          {userData.data?.data?.whisper_url === "" && (
            <PaperBox title={"No Whisper URL"} warning>
              <Typography variant="body1" color={"text.secondary"} m={2}>
                You have not set a Whisper URL yet. You can do this in the
                settings. Without a Whisper URL, you cannot transcribe your
                lectures.
              </Typography>
            </PaperBox>
          )}
          <JoinRoomsBox />
          <HostedRoomsBox />
          <PersonalizeBox />
        </Masonry>
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
              router.replace("/signup");
            }}
          >
            Try It for Free
          </Button>
        </Box>
      </Container>
    );
  }
}
