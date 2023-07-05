"use client";

import LearningDifficulties from "@/common/PageComponents/personalize/page/LearningDifficulties";
import LearningStyle from "@/common/PageComponents/personalize/page/LearningStyle";
import PersonalInformation from "@/common/PageComponents/personalize/page/PersonalInformation";
import Save from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React from "react";

const steps = [
  "Personal information",
  "Learning difficulties",
  "Learning style",
  "Save",
];
export default function Page() {
  const [activeStep, setActiveStep] = React.useState(0);
  return (
    <Container
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
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box my={2} flex={1}>
          {activeStep === 0 && <PersonalInformation />}
          {activeStep === 1 && <LearningDifficulties />}
          {activeStep === 2 && <LearningStyle />}
          {activeStep === 3 && <Save />}
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
              }}
            >
              Back
            </Button>
            <Button
              variant={"outlined"}
              sx={{
                visibility:
                  activeStep === steps.length - 1 ? "hidden" : "block",
                m: 2,
              }}
              onClick={() => {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
