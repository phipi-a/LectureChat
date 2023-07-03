"use client";

import { Box, Divider, Paper, Typography } from "@mui/material";

export function PaperBox({ children, title, button }: any) {
  return (
    <Box overflow={"auto"} width={"100%"} p={2}>
      <Paper>
        <Box height={"100%"} flexDirection={"column"} display={"flex"} m={1}>
          <Box display={"flex"} alignItems={"center"}>
            <Typography variant={"h6"}>{title}</Typography>
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