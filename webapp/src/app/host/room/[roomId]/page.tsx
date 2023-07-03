"use client";
import { MainContainerFallback } from "@/common/components/general/MainContainerFallback";
import { PdfBulletpointContainer } from "@/common/components/general/PdfBulletpointContainer";
import { VideoBulletPointContainer } from "@/common/components/general/VideoBulletpointContainer";
import { HostRoomHeader } from "@/common/components/host/roomPage/HostRoomHeader";
import { LiveAudioTranscriptionBox } from "@/common/components/host/roomPage/LiveAudioTranscriptionBox";
import { LiveAudioTranscriptionBoxFallback } from "@/common/components/host/roomPage/LiveAudioTranscriptionBoxFallback";
import { VideoTranscriptionBox } from "@/common/components/host/roomPage/VideoTranscriptionBox";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { Box } from "@mui/material";
import React, { Suspense } from "react";
import "./page.css";
export default function Room({ params }: { params: { roomId: string } }) {
  const [whisperUrl, setWhisperUrl] = React.useState<string>(
    "http://localhost:9000"
  );

  const getRoom = useGetData(
    ["host", "room", params.roomId],

    supabase
      .from("room")
      .select("*")
      .eq("id", params.roomId)
      .single()
  );

  const room = getRoom.data?.data;

  return (
    <>
      {room?.is_video_room ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          flex={1}
          overflow={"auto"}
        >
          <HostRoomHeader
            title={room!.title}
            roomId={room!.id}
            password={room!.password}
            whisperUrl={whisperUrl}
            setWhisperUrl={setWhisperUrl}
          />
          <Suspense fallback={<></>}>
            <VideoTranscriptionBox
              roomId={params.roomId}
              whisperUrl={whisperUrl}
            />
          </Suspense>
          <Box display={"flex"} flex={1} overflow={"auto"}>
            <Suspense fallback={<MainContainerFallback />}>
              <VideoBulletPointContainer videoUrl={room!.video_url} />
            </Suspense>
          </Box>
        </Box>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          flex={1}
          overflow={"auto"}
        >
          <HostRoomHeader
            title={room!.title}
            roomId={room!.id}
            password={room!.password}
            whisperUrl={whisperUrl}
            setWhisperUrl={setWhisperUrl}
          />
          <Suspense fallback={<LiveAudioTranscriptionBoxFallback />}>
            <LiveAudioTranscriptionBox
              roomId={params.roomId}
              whisperUrl={whisperUrl}
            />
          </Suspense>
          <Suspense fallback={<MainContainerFallback />}>
            <PdfBulletpointContainer roomId={params.roomId} />
          </Suspense>
        </Box>
      )}
    </>
  );
}
