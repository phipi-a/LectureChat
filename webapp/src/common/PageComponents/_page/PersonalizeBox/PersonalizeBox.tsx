"use client";
import ColoredCircularProgress from "@/common/Components/ColoredCircularProgress";
import PaperBox from "@/common/Components/PaperBox";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { AutoAwesomeOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

export function PersonalizeBox() {
  const router = useOwnRouter();
  return (
    <PaperBox
      title={"Personalize your experience"}
      button={
        <Button
          variant="outlined"
          color="primary"
          sx={{
            m: 1,
          }}
          onClick={() => {
            router.push("/personalize");
          }}
        >
          <Typography
            display={{
              xs: "none",
              sm: "block",
            }}
          >
            Personalize
          </Typography>
          <AutoAwesomeOutlined />
        </Button>
      }
    >
      <Box display={"flex"} flexDirection={"row"} m={2}>
        <Typography variant={"body1"} color={"text.secondary"}>
          Unlock a personalized learning experience with our chatbot! As you
          complete the survey and tasks, the chatbot adapts to your preferences
          and customizes its answers to enhance your learning journey
        </Typography>
        <Box>
          <ColoredCircularProgress value={30} />
        </Box>
      </Box>
    </PaperBox>
  );
}
