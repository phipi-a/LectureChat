import { PersonalInformationI } from "@/common/Interfaces/Interfaces";
import { Autocomplete, Chip, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

export function PersonalInformation({
  personalInformation,
  setPersonalInformation,
}: {
  personalInformation: PersonalInformationI;
  setPersonalInformation: (personalInformation: PersonalInformationI) => void;
}) {
  return (
    <>
      <Typography variant={"h6"}>Personal information</Typography>
      <Box display={"flex"} flexDirection={"column"} component={"form"}>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            👤
          </Typography>
          <TextField
            label="Name"
            margin="normal"
            autoFocus
            sx={{
              flex: 1,
            }}
            value={
              personalInformation.name === null ? "" : personalInformation.name
            }
            onChange={(event) => {
              setPersonalInformation({
                ...personalInformation,
                name: event.target.value === "" ? null : event.target.value,
              });
            }}
          />

          <TextField
            label="Age"
            margin="normal"
            type={"number"}
            sx={{
              marginLeft: 2,
              maxWidth: 120,
            }}
            value={
              personalInformation.age === null ? "" : personalInformation.age
            }
            onChange={(event) => {
              setPersonalInformation({
                ...personalInformation,
                age:
                  event.target.value === ""
                    ? null
                    : parseInt(event.target.value),
              });
            }}
          />
        </Box>
        <Typography m={2} color={"text.secondary"}>
          What is your preferred language for learning?
        </Typography>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            💬
          </Typography>
          <TextField
            label="Language"
            margin="normal"
            value={
              personalInformation.language === null
                ? ""
                : personalInformation.language
            }
            onChange={(event) => {
              setPersonalInformation({
                ...personalInformation,
                language: event.target.value === "" ? null : event.target.value,
              });
            }}
            sx={{
              flex: 1,
            }}
          />
        </Box>
        <Typography m={2} color={"text.secondary"}>
          What are your hobbies? (Press enter to add one to the list)
        </Typography>

        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            ⚽️
          </Typography>

          <Autocomplete
            multiple
            sx={{
              flex: 1,
            }}
            id="tags-filled"
            options={[]}
            value={
              personalInformation.hobbies === null
                ? []
                : personalInformation.hobbies
            }
            onChange={(event, value) => {
              console.log(value);
              setPersonalInformation({
                ...personalInformation,
                hobbies: value.length === 0 ? null : value,
              });
            }}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label="Hobbies"
                placeholder="Press enter to add"
              />
            )}
          />
        </Box>
        <Typography m={2} color={"text.secondary"}>
          What are your favorite topics? (Press enter to add one to the list)
        </Typography>
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
          <Typography fontSize={24} m={2}>
            📚
          </Typography>

          <Autocomplete
            multiple
            id="tags-filled"
            options={[]}
            value={
              personalInformation.favorite_topics === null
                ? []
                : personalInformation.favorite_topics
            }
            onChange={(event, value) => {
              console.log(value);
              setPersonalInformation({
                ...personalInformation,
                favorite_topics: value.length === 0 ? null : value,
              });
            }}
            sx={{
              flex: 1,
            }}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label="Favorite Topics"
                placeholder="Press enter to add"
              />
            )}
          />
        </Box>
      </Box>
    </>
  );
}
