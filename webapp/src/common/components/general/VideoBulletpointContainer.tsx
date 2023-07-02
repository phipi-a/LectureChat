"use client";

import { Box } from "@mui/material";
import { Resizable } from "re-resizable";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { DropVideoFileBox } from "../host/createNewRecordingRoom/DropVideoFileBox";
import ReactPlayer from "react-player";
import "./v.css";

export function VideoBulletPointContainer({ roomId }: { roomId: string }) {
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  const [width, setWidth] = React.useState(500);
  const [height, setHeight] = React.useState(500);
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        height: "100%",
        flexDirection: "row",
      }}
    >
      <Box m={1}>
        <DropVideoFileBox
          onFileChanged={(file) => {
            setVideoFile(file);
          }}
        />
      </Box>
      <Resizable
        defaultSize={{
          width: width,
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
        onResizeStop={(e, direction, ref, d) => {
          setWidth(width + d.width);
        }}
        lockAspectRatio={true}
      >
        <Box height={"100%"}>
          <div className="player-wrapper">
            <ReactPlayer
              className="react-player"
              url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
              width="100%"
              height="100%"
            />
          </div>
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
        <ul>
          <li>Bulletpoint 1 example</li>
          <li>Bulletpoint 2 example</li>
          <li>Bulletpoint 3 example</li>
        </ul>
      </Box>
    </Box>
  );
}
