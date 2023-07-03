"use client";
import { CircularRating } from "@/common/elements/CircularRating";
import { PaperBox } from "@/common/elements/PaperBox";
import { AutoAwesomeOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export function PersonalizeStartPage() {
  const router = useRouter();
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
          Personalize
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
          <CircularRating value={30} />
        </Box>
      </Box>
    </PaperBox>
  );
}
