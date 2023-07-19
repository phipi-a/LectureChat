"use client";

import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import {
  LearningDifficultiesI,
  LearningStyleI,
  PersonalInformationI,
} from "@/common/Interfaces/Interfaces";
import { useOwnRouter } from "@/common/Modules/OwnRouter";
import { supabase } from "@/common/Modules/SupabaseClient";
import LearningDifficulties from "@/common/PageComponents/personalize/page/LearningDifficulties";
import LearningStyle from "@/common/PageComponents/personalize/page/LearningStyle";
import PersonalInformation from "@/common/PageComponents/personalize/page/PersonalInformation";
import { useUpsertSelectData } from "@/utils/supabase/supabaseData";
import { useUserData } from "@/utils/supabase/supabaseQuery";
import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useQueryClient } from "react-query";

const steps = [
  "Personal information",
  "Learning difficulties",
  "Learning style",
];
export default function Page() {
  const { userId } = useContext(AuthContext);
  const router = useOwnRouter();

  const queryClient = useQueryClient();
  const [userInformation, setUserInformation] = useUserData(
    userId,
    queryClient
  );

  const [personalInformationTemp, setPersonalInformationTemp] =
    React.useState<PersonalInformationI>({
      name: userInformation.data?.data?.name ?? null,
      age: userInformation.data?.data?.age ?? null,
      language: userInformation.data?.data?.language ?? null,
      hobbies: userInformation.data?.data?.hobbies ?? null,
      favorite_topics: userInformation.data?.data?.favorite_topics ?? null,
    });

  const [learningDifficultiesTemp, setLearningDifficultiesTemp] =
    React.useState<LearningDifficultiesI>({
      subject_difficulty:
        userInformation.data?.data?.subject_difficulty ?? null,
      difficulty: userInformation.data?.data?.difficulty ?? null,
    });

  const [learningStyleTemp, setLearningStyleTemp] =
    React.useState<LearningStyleI>({
      emojis: userInformation.data?.data?.emojis ?? null,
      person: userInformation.data?.data?.person ?? null,
      storytelling: userInformation.data?.data?.storytelling ?? null,
    });

  const personalInformationTempRef = React.useRef(personalInformationTemp);
  const learningDifficultiesTempRef = React.useRef(learningDifficultiesTemp);
  const learningStyleTempRef = React.useRef(learningStyleTemp);

  const mutation = useUpsertSelectData(supabase.from("user"), {
    onSuccess: (res) => {
      setUserInformation(res.data![0]);
    },
  });
  useEffect(() => {
    personalInformationTempRef.current = personalInformationTemp;
    learningDifficultiesTempRef.current = learningDifficultiesTemp;
    learningStyleTempRef.current = learningStyleTemp;
  }, [personalInformationTemp, learningDifficultiesTemp, learningStyleTemp]);

  function uploadData() {
    console.log("uploading", {
      ...personalInformationTempRef.current,
      ...learningDifficultiesTempRef.current,
      ...learningStyleTempRef.current,
      id: userId!,
    });
    mutation.mutate({
      ...personalInformationTempRef.current,
      ...learningDifficultiesTempRef.current,
      ...learningStyleTempRef.current,
      id: userId!,
    });
  }
  useEffect(() => {
    return () => {
      console.log("unmounting");
      uploadData();
    };
  }, []);

  const [activeStep, setActiveStep] = React.useState(0);
  return (
    <Container
      maxWidth={"sm"}
      style={{
        height: "100%",
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={{ my: 2 }}
        height={"100%"}
      >
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step
                key={label}
                onClick={() => {
                  setActiveStep(steps.indexOf(label));
                }}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box my={2}>
          {activeStep === 0 && (
            <PersonalInformation
              personalInformation={personalInformationTemp!}
              setPersonalInformation={setPersonalInformationTemp}
            />
          )}
          {activeStep === 1 && (
            <LearningDifficulties
              learningDifficulties={learningDifficultiesTemp!}
              setLearningDifficulties={setLearningDifficultiesTemp}
            />
          )}
          {activeStep === 2 && (
            <LearningStyle
              learningStyle={learningStyleTemp!}
              setLearningStyle={setLearningStyleTemp}
            />
          )}
        </Box>
        <Box display={"flex"} justifyContent={"center"}>
          <Box display={"flex"} my={2}>
            <Button
              variant={"outlined"}
              sx={{
                visibility: activeStep === 0 ? "hidden" : "block",
                m: 2,
              }}
              onClick={() => {
                setActiveStep((prevActiveStep) => prevActiveStep - 1);
                uploadData();
              }}
            >
              Back
            </Button>
            <Button
              variant={"outlined"}
              sx={{
                display: activeStep === steps.length - 1 ? "none" : "block",
                m: 2,
              }}
              onClick={() => {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                uploadData();
              }}
            >
              Next
            </Button>
            <Button
              variant={"outlined"}
              color="success"
              sx={{
                display: activeStep === steps.length - 1 ? "block" : "none",
                m: 2,
              }}
              onClick={() => {
                uploadData();
                router.replace("/");
              }}
            >
              Finish
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
