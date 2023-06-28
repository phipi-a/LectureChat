import { Box, CircularProgress } from "@mui/material";
import React from "react";
export function CenteredLoading() {
  return (
    <Box
      position={"absolute"}
      top={"50%"}
      left={"50%"}
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <CircularProgress></CircularProgress>
    </Box>
  );
}
