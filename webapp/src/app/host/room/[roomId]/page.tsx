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
export default function Room({ params }: { params: { roomId: string } }) {
  const [page, setPage] = React.useState<number>(1);
  const [whisperUrl, setWhisperUrl] = React.useState<string>(
    "http://localhost:9000"
  );

  const getRoom = useGetData(
    ["host", "room", params.roomId],
    supabase.from("room").select("*").eq("id", params.roomId).single()
  );

  if (getRoom.isLoading) {
    return <CenteredLoading />;
  }
  const room = getRoom.data?.data;

  return (
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
  );
}
