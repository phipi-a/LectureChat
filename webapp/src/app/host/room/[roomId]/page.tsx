"use client";
import "./page.css";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import React from "react";
import { PdfBulletpointContainer } from "@/common/components/general/PdfBulletpointContainer";
import { HostRoomHeader } from "@/common/components/host/roomPage/HostRoomHeader";
import { LiveAudioTranscriptionBox } from "@/common/components/host/roomPage/LiveAudioTranscriptionBox";
import { CenteredLoading } from "@/common/components/general/CenteredLoading";

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
      <LiveAudioTranscriptionBox
        roomId={params.roomId}
        whisperUrl={whisperUrl}
        page={page}
      />

      <PdfBulletpointContainer
        roomId={params.roomId}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}
