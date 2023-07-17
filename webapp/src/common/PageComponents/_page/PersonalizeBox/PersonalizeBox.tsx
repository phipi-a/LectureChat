"use client";
import ColoredCircularProgress from "@/common/Components/ColoredCircularProgress";
import PaperBox from "@/common/Components/PaperBox";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { supabase } from "@/common/Modules/SupabaseClient";
import { useGetData } from "@/utils/supabase/supabaseData";
import { AutoAwesomeOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";

export function PersonalizeBox() {
  const router = useOwnRouter();
  const { userId } = useContext(AuthContext);
  const userInformation = useGetData(
    ["userData", userId!],
    supabase.from("user").select("*").eq("id", userId!).single()
  );
  console.log("use", userInformation);
  function progressPersonalize() {
    let num_of_attributes = 0;
    if (userInformation.data?.data?.age !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.language !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.hobbies !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.favorite_topics !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.subject_difficulty !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.difficulty !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.storytelling !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.person !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.name !== null) {
      num_of_attributes++;
    }
    if (userInformation.data?.data?.emojis !== null) {
      num_of_attributes++;
    }
    return (num_of_attributes / 10) * 100;
  }
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
            router.replace("/personalize");
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
          <ColoredCircularProgress value={progressPersonalize()} />
        </Box>
      </Box>
    </PaperBox>
  );
}
