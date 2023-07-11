"use client";

import Link from "@/common/Components/Link";
import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import ReactPlayer from "react-player";
import DropFileBox from "../../DropFileBox";
import GeneralMainContainerSuspense from "../GeneralMediaBulletPointContainer";
import "./v.css";

export function VideoBulletPointContainerSuspense({
  videoUrl,
  roomId,
}: {
  videoUrl: string | null;
  roomId: string;
}) {
  const searchParams = useSearchParams();
  const def_videoUrl = videoUrl;
  const searchVideoUrl = searchParams.get("videoUrl");
  if (
    (videoUrl === null || !ReactPlayer.canPlay(videoUrl)) &&
    searchVideoUrl !== null
  ) {
    videoUrl = searchParams.get("videoUrl");
  }
  const [videoURL, setVideoURL] = React.useState<string | null>(videoUrl);
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
    <GeneralMainContainerSuspense
      width={width}
      setWidth={setWidth}
      roomId={roomId}
    >
      {ReactPlayer.canPlay(videoURL!) || videoUrlFilePath !== "" ? (
        <div className="player-wrapper">
          <ReactPlayer
            onError={(e) => {
              if (e.type === "error") {
                if (videoURL?.startsWith("blob:")) {
                  setVideoURL(def_videoUrl);
                }
              }
            }}
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
            url={videoUrlFilePath !== "" ? videoUrlFilePath : videoURL!}
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
          {videoURL?.trim() !== "" ? (
            <>
              <Typography variant={"h6"}>Video not found</Typography>
              <Typography variant={"body1"}>
                The following link was provided:
              </Typography>

              <Link href={videoURL!}>
                <Typography
                  variant={"body1"}
                  textOverflow={"ellipsis"}
                  maxWidth={"200px"}
                  overflow={"hidden"}
                  whiteSpace={"nowrap"}
                >
                  {videoURL}
                </Typography>
              </Link>
            </>
          ) : (
            <></>
          )}
          <Box m={3}>
            <DropFileBox
              onFileChanged={function (file: any): void {
                const temporaryURL = URL.createObjectURL(file);

                setVideoUrlFilePath(temporaryURL);
              }}
              dataType={"video"}
            />
          </Box>
        </Box>
      )}
    </GeneralMainContainerSuspense>
  );
}
