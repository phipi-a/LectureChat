"use client";

import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import {
  useDeleteData,
  useGetData,
  useInsertSelectData,
  useUpsertData,
} from "@/utils/supabase/supabaseData";
import { MicOff, MicOutlined } from "@mui/icons-material";
import { Box, CircularProgress, Collapse, IconButton } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useMutation } from "react-query";
import { TranscriptionEditBox } from "../TranscriptionEditBox/TranscriptionEditBox";
import { AudioRecorder } from "./AudioRecorder";

export function LiveAudioTranscriptionBox({
  roomId,
  whisperUrl,
}: {
  roomId: string;
  whisperUrl: string;
}) {
  const { currentPage } = useContext(RoomContext);
  const [recordingState, setRecordingState] = React.useState<
    "recording" | "stoped"
  >("stoped");
  const [microphoneActive, setMicrophoneActive] =
    React.useState<boolean>(false);

  const [transcriptBoxOpen, setTranscriptBoxOpen] = React.useState(false);
  const { segments, setSegments } = useContext(RoomContext);
  const getInitData = useGetData(
    ["host", "room", roomId, "initData"],
    supabase.from("data").select("*").eq("room_id", roomId)
  );
  useEffect(() => {
    setSegments(getInitData.data?.data || []);
  }, [getInitData.data?.data]);

  const uploadAudio = useMutation({
    mutationFn: (audioBlob: Blob) => {
      const url = whisperUrl + "/asr?&output=json&language=en&";

      const formData = new FormData();
      formData.append("audio_file", audioBlob);

      return fetch(url, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (data.text.length > 0) {
        insertData.mutate({
          room_id: roomId,
          data: data.text,
          page: currentPage,
        });
      }
    },
  });
  const insertData = useInsertSelectData(supabase.from("data"), {
    onSuccess: (dataRes) => {
      segments!.push(dataRes.data![0]);
      setSegments([...segments!]);
    },
  });
  const upsertData = useUpsertData(supabase.from("data"));
  const deleteData = useDeleteData(supabase.from("data"));

  function updateDataItem(item: any) {
    segments!.find((d) => d.id === item.id)!.data = item.data;
    setSegments([...segments!]);
    upsertData.mutate(item);
  }
  function deleteDataItem(item: any) {
    deleteData.mutate({
      field: "id",
      value: item.id,
    });
    setSegments([...segments!.filter((d) => d.id !== item.id)]);
  }

  function deleteAllData() {
    deleteData.mutate({
      field: "room_id",
      value: roomId,
    });
    setSegments([]);
  }

  if (getInitData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      display={"flex"}
      justifyContent={"end"}
      mx={5}
      flexDirection={"row"}
      alignItems={transcriptBoxOpen ? "flex-start" : "center"}
    >
      <AudioRecorder
        newAudioBlobCallback={function (blob: Blob): void {
          uploadAudio.mutate(blob);
        }}
        recordingStateCallback={function (state: "recording" | "stoped"): void {
          setRecordingState(state);
        }}
        longPauseCallback={() => {}}
        recordingMuteState={microphoneActive}
      />
      <IconButton
        onClick={
          microphoneActive
            ? () => {
                setMicrophoneActive(false);
              }
            : () => {
                setMicrophoneActive(true);
              }
        }
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress
            sx={{
              visibility:
                uploadAudio.isLoading || insertData.isLoading
                  ? "visible"
                  : "hidden",
            }}
          />
          <MicOutlined
            sx={{
              position: "absolute",
              display: microphoneActive ? "block" : "none",
            }}
            color={recordingState === "recording" ? "primary" : "inherit"}
          />
          <MicOff
            color={"error"}
            sx={{
              position: "absolute",
              display: microphoneActive ? "none" : "block",
            }}
          />
        </Box>
      </IconButton>

      <Box
        sx={{
          border: "3px solid",
          borderColor: "primary.main",
          borderRadius: "5px",
          overflow: "hidden",
          display: "flex",
          p: 2,
        }}
        flex={1}
        onClick={
          transcriptBoxOpen ? undefined : () => setTranscriptBoxOpen(true)
        }
      >
        <Collapse in={transcriptBoxOpen} collapsedSize={"2em"}>
          <TranscriptionEditBox
            editable={true}
            rawData={segments}
            updateDataItem={updateDataItem}
            deleteDataItem={deleteDataItem}
            deleteAllData={deleteAllData}
            transcriptBoxOpen={transcriptBoxOpen}
            setTranscriptBoxOpen={setTranscriptBoxOpen}
          />
        </Collapse>
      </Box>
    </Box>
  );
}
