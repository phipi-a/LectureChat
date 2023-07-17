"use client";

import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
export function PaperBox({ children, title, button, warning = false }: any) {
  const theme = useTheme();

  return (
    <Box overflow={"auto"} width={"100%"}>
      <Paper variant={theme.palette.mode === "dark" ? "elevation" : "outlined"}>
        <Box height={"100%"} flexDirection={"column"} display={"flex"}>
          <Box display={"flex"} alignItems={"center"}>
            <Typography
              variant={"h6"}
              color={warning ? "warning.main" : ""}
              mx={2}
              my={1.2}
            >
              {title}
            </Typography>
            <Box flexGrow={1} />
            {button}
          </Box>

          <Divider variant="middle" />

          {children}
        </Box>
      </Paper>
    </Box>
  );
}
