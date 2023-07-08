"use client";

import Link from "@/common/Components/Link";
import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import ReactPlayer from "react-player";
import DropFileBox from "../../DropFileBox";
import MainContainerSuspense from "../MainMediaBulletPointContainer";
import "./v.css";

export function VideoBulletPointContainerSuspense({
  videoUrl,
  roomId,
}: {
  videoUrl: string | null;
  roomId: string;
}) {
  const { playPosition } = useContext(RoomContext);
  const [duration, setDuration] = React.useState<number>(0);
  const [playing, setPlaying] = React.useState<boolean>(false);
  const player = React.useRef<ReactPlayer>(null);
  const [width, setWidth] = React.useState(500);
  const [videoUrlFilePath, setVideoUrlFilePath] = React.useState<string>("");

  useEffect(() => {
    if (player.current && duration !== 0) {
      player.current.seekTo(playPosition.pos / duration);
      setPlaying(true);
    }
  }, [playPosition, player]);
  return (
    <MainContainerSuspense width={width} setWidth={setWidth} roomId={roomId}>
      {ReactPlayer.canPlay(videoUrl!) || videoUrlFilePath !== "" ? (
        <div className="player-wrapper">
          <ReactPlayer
            onError={(e) => {}}
            onReady={() => {}}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
            ref={player}
            onDuration={(duration) => {
              setDuration(duration);
            }}
            controls={true}
            playing={playing}
            onPlay={() => {
              setPlaying(true);
            }}
            onPause={() => {
              setPlaying(false);
            }}
            className="react-player"
            url={videoUrlFilePath !== "" ? videoUrlFilePath : videoUrl!}
            width="100%"
            height="100%"
          />
        </div>
      ) : (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          {videoUrl?.trim() !== "" ? (
            <>
              <Typography variant={"h6"}>Video not found</Typography>
              <Typography variant={"body1"}>
                The following link was provided:
              </Typography>

              <Link href={videoUrl!}>
                <Typography
                  variant={"body1"}
                  textOverflow={"ellipsis"}
                  maxWidth={"200px"}
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                >
                  {videoUrl}
                </Typography>
              </Link>
            </>
          ) : (
            <></>
          )}
          <DropFileBox
            onFileChanged={function (file: any): void {
              const temporaryURL = URL.createObjectURL(file);

              setVideoUrlFilePath(temporaryURL);
            }}
            dataType={"video"}
          />
        </Box>
      )}
    </MainContainerSuspense>
  );
}