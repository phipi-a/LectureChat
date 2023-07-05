import { Box, Typography } from "@mui/material";

export function AppLogo() {
  return (
    <Typography
      variant={"h3"}
      color={"primary"}
      fontFamily={"monospace"}
      fontWeight={"bold"}
    >
      <Box component="span" color={"text.primary"}>
        Lecture
      </Box>
      Chat
    </Typography>
  );
}
