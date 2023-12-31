"use client";
import Link from "@/common/Components/Link";
import { Box, Container, Typography } from "@mui/material";

export default function SetupPage() {
  return (
    <main>
      <Container maxWidth={"sm"}>
        <Box display={"flex"} flexDirection={"column"} sx={{ my: 2 }}>
          <Typography
            variant={"h4"}
            fontFamily={"monospace"}
            fontWeight={"bold"}
          >
            How to setup 🔨
          </Typography>
          <br />
          <Typography
            whiteSpace={"pre-line"}
            variant="h6"
            color={"primary"}
            letterSpacing={0}
            fontFamily={"monospace"}
          >
            OpenAI 🦿
            <br />
            <Box component={"span"} color={"text.primary"}>
              To setup the project you currently need to get an api key from
              openai.
            </Box>
            <Box component={"span"} color={"text.primary"}>
              Please head over to{" "}
              <Link href={"https://platform.openai.com/"}>OpenAI</Link> an
              create an account. You can then setup a new key by clicking on
              your profile picture, then on {'"View API keys"'} and then click
              on create new secret key. You can then add your key in the
              settings.
            </Box>
          </Typography>
          <br />
          <Typography
            whiteSpace={"pre-line"}
            variant="h6"
            color={"primary"}
            letterSpacing={0}
            fontFamily={"monospace"}
          >
            Whisper 👂
            <br />
            <Box component={"span"} color={"text.primary"}>
              For speach to text we require a self hosted instance of the
              whisper asr service. You can find the source code and setup
              instructions on the{" "}
              <Link
                href={
                  "https://github.com/phipi-a/LectureChat/tree/main/whisper"
                }
              >
                github page
              </Link>
              . After setting up the docker image you can add the url to the
              settings. You have to build the docker image yourself, because we
              use a modified version of the whisper asr service.
            </Box>
          </Typography>
          <br />
          <Typography
            whiteSpace={"pre-line"}
            variant="h6"
            color={"primary"}
            letterSpacing={0}
            fontFamily={"monospace"}
          >
            Future plans 🚀
            <br />
            <Box component={"span"} color={"text.primary"}>
              Currently we only provide the option to setup the docker image and
              an own openai key. In the future we want to offer a monthly
              suscribtion plan that makes the setup process easier.
            </Box>
          </Typography>
          <br />
        </Box>
      </Container>
    </main>
  );
}
