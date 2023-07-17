import { LearningStyleI } from "@/common/Interfaces/Interfaces";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export function LearningStyle({
  learningStyle,
  setLearningStyle,
}: {
  learningStyle: LearningStyleI;
  setLearningStyle: (learningStyle: LearningStyleI) => void;
}) {
  return (
    <>
      <Typography variant={"h4"}>Learning Style</Typography>
      <Box display={"flex"} flexDirection={"column"} component={"form"}>
        <Typography m={2} color={"text.secondary"}>
          Do you think emojis could be helpful or beneficial in your learning
          process?
        </Typography>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            🔥
          </Typography>
          <FormControl
            sx={{
              flex: 1,
            }}
          >
            <InputLabel id="demo-simple-select-label">Emojis</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Emojis"
              autoFocus
              value={
                learningStyle.emojis === null
                  ? ""
                  : learningStyle.emojis === true
                  ? 1
                  : 2
              }
              onChange={(event) => {
                let a: boolean | null;
                if (Number(event.target.value) == 1) {
                  a = true;
                } else if (Number(event.target.value) == 2) {
                  a = false;
                } else {
                  a = null;
                }
                setLearningStyle({
                  ...learningStyle,
                  emojis: a,
                });
              }}
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={2}>No</MenuItem>
              <MenuItem value={""}>None</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography m={2} color={"text.secondary"}>
          Whom would you like to have a conversation with? You can also provide
          a brief description of the person.
        </Typography>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            ✳️
          </Typography>
          <TextField
            label="Person"
            margin="normal"
            value={learningStyle.person === null ? "" : learningStyle.person}
            onChange={(event) => {
              setLearningStyle({
                ...learningStyle,
                person: event.target.value === "" ? null : event.target.value,
              });
            }}
            sx={{
              flex: 1,
            }}
          />
        </Box>
        <Typography m={2} color={"text.secondary"}>
          Do you believe storytelling can simplify your learning process? Or do
          you enjoy stories?
        </Typography>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            📖
          </Typography>
          <FormControl
            sx={{
              flex: 1,
            }}
          >
            <InputLabel id="demo-simple-select-label">Stories</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={
                learningStyle.storytelling === null
                  ? ""
                  : learningStyle.storytelling === true
                  ? 1
                  : 2
              }
              onChange={(event) => {
                let a: boolean | null;
                if (Number(event.target.value) == 1) {
                  a = true;
                } else if (Number(event.target.value) == 2) {
                  a = false;
                } else {
                  a = null;
                }
                setLearningStyle({
                  ...learningStyle,
                  storytelling: a,
                });
              }}
              label="Stories"
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={2}>No</MenuItem>
              <MenuItem value={""}>None</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
