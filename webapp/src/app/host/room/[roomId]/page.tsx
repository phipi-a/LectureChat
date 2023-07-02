"use client";
import "./page.css";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import React, { Suspense } from "react";
import { PdfBulletpointContainer } from "@/common/components/general/PdfBulletpointContainer";
import { HostRoomHeader } from "@/common/components/host/roomPage/HostRoomHeader";
import { LiveAudioTranscriptionBox } from "@/common/components/host/roomPage/LiveAudioTranscriptionBox";
import { CenteredLoading } from "@/common/components/general/CenteredLoading";
import { PdfBulletpointContainerFallback } from "@/common/components/general/PdfBulletpointContainerFallback";
import { LiveAudioTranscriptionBoxFallback } from "@/common/components/host/roomPage/LiveAudioTranscriptionBoxFallback";
import { VideoTranscriptionBox } from "@/common/components/host/roomPage/VideoTranscriptionBox";
import { VideoBulletPointContainer } from "@/common/components/general/VideoBulletpointContainer";
import { Box } from "@mui/material";
export default function Room({ params }: { params: { roomId: string } }) {
  const [page, setPage] = React.useState<number>(1);
  const [whisperUrl, setWhisperUrl] = React.useState<string>(
    "http://localhost:9000"
  );

  const getRoom = useGetData(
    ["host", "room", params.roomId],
    supabase.from("room").select("*").eq("id", params.roomId).single()
  );

  const room = getRoom.data?.data;

  return (
    <>
      {room?.is_video_room ? (
        <Box>
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
              page={page}
            />
          </Suspense>
          <Box display={"inline-block"}>
            <Suspense fallback={<></>}>
              <VideoBulletPointContainer roomId={params.roomId} />
            </Suspense>
          </Box>
        </Box>
      ) : (
        <div>
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
              page={page}
            />
          </Suspense>
          <Suspense fallback={<PdfBulletpointContainerFallback />}>
            <PdfBulletpointContainer
              roomId={params.roomId}
              page={page}
              setPage={setPage}
            />
          </Suspense>
        </div>
      )}
    </>
  );
}
