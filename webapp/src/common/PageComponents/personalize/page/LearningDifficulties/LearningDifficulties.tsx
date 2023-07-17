import { LearningDifficultiesI } from "@/common/Interfaces/Interfaces";
import { Box, TextField, Typography } from "@mui/material";

export function LearningDifficulties({
  learningDifficulties,
  setLearningDifficulties,
}: {
  learningDifficulties: LearningDifficultiesI;
  setLearningDifficulties: (
    learningDifficulties: LearningDifficultiesI
  ) => void;
}) {
  return (
    <>
      <Typography variant={"h4"}>Learning Difficulties</Typography>
      <Box display={"flex"} flexDirection={"column"} component={"form"}>
        <Typography m={2} color={"text.secondary"}>
          Please describe your Subject in which you are facing difficulties
        </Typography>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            🧐
          </Typography>
          <TextField
            value={
              learningDifficulties.subject_difficulty === null
                ? ""
                : learningDifficulties.subject_difficulty
            }
            onChange={(event) => {
              setLearningDifficulties({
                ...learningDifficulties,
                subject_difficulty:
                  event.target.value === "" ? null : event.target.value,
              });
            }}
            label="Subject"
            margin="normal"
            autoFocus
            sx={{
              flex: 1,
            }}
          />
        </Box>
        <Typography m={2} color={"text.secondary"}>
          Do you have any diagnosed learning difficulties? Or do you think you
          have any learning difficulties?
        </Typography>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            🎒
          </Typography>
          <TextField
            value={
              learningDifficulties.difficulty === null
                ? ""
                : learningDifficulties.difficulty
            }
            onChange={(event) => {
              setLearningDifficulties({
                ...learningDifficulties,
                difficulty:
                  event.target.value === "" ? null : event.target.value,
              });
            }}
            label="Learning Difficulties"
            margin="normal"
            sx={{
              flex: 1,
            }}
          />
        </Box>
      </Box>
    </>
  );
}
