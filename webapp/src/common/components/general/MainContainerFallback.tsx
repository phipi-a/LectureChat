import { Box, Skeleton } from "@mui/material";
import { Resizable } from "re-resizable";
import React from "react";

export function MainContainerFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        width: "100%",
        flexDirection: "row",
      }}
    >
      <Resizable
        defaultSize={{
          width: 500,
          height: "100%",
        }}
        maxWidth={"90%"}
        minWidth={"10%"}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <Box flex={1}>
          <Skeleton variant={"rectangular"} height={"400px"} width={"100%"} />
        </Box>
      </Resizable>
      <Box
        flex={1}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "3px",
            backgroundColor: "#1565c0",
            zIndex: 1,
            transform: "translateX(-1px)",
          }}
        ></Box>
        {/*
          example bullet point*/}
        <Box width={"70%"} m={2}>
          <Skeleton variant={"text"} width={"100%"} />
          <Skeleton variant={"text"} width={"80%"} />
          <Skeleton variant={"text"} width={"90%"} />
        </Box>
      </Box>
    </Box>
  );
}
