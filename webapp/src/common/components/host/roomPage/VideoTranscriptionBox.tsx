"use client";

import { supabase } from "@/common/modules/supabase/supabaseClient";
import {
  useGetData,
  useInsertSelectData,
  useUpsertData,
  useDeleteData,
} from "@/lib/utils/supabase/supabaseData";
import { MicOutlined, MicOff } from "@mui/icons-material";
import { Box, IconButton, CircularProgress, Collapse } from "@mui/material";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { AudioRecorder } from "../transcription/AudioRecorder";
import { TranscriptionBox } from "./TranscriptionBox";

export function VideoTranscriptionBox({
  roomId,
  whisperUrl,
  page,
}: {
  roomId: string;
  whisperUrl: string;
  page: number;
}) {
  const [transcriptBoxOpen, setTranscriptBoxOpen] = React.useState(false);

  const getInitData = useGetData(
    ["host", "room", roomId, "initData"],
    supabase.from("data").select("*").eq("room_id", roomId)
  );
  const [data, setData] = React.useState<any[]>(getInitData.data?.data || []);

  const insertData = useInsertSelectData(supabase.from("data"), {
    onSuccess: (dataRes) => {
      data.push(dataRes.data![0]);
      setData([...data]);
    },
  });
  const upsertData = useUpsertData(supabase.from("data"));
  const deleteData = useDeleteData(supabase.from("data"));

  function updateDataItem(item: any) {
    data.find((d) => d.id === item.id).data = item.data;
    setData([...data]);
    upsertData.mutate(item);
  }
  function deleteDataItem(item: any) {
    deleteData.mutate({
      field: "id",
      value: item.id,
    });
    setData([...data.filter((d) => d.id !== item.id)]);
  }

  return (
    <Box
      display={"flex"}
      justifyContent={"end"}
      mx={5}
      flexDirection={"row"}
      alignItems={transcriptBoxOpen ? "flex-start" : "center"}
    >
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
          <TranscriptionBox
            editable={true}
            enableDeleteAll={false}
            alignText="left"
            rawData={data}
            updateDataItem={updateDataItem}
            deleteDataItem={deleteDataItem}
            deleteAllData={() => {}}
            transcriptBoxOpen={transcriptBoxOpen}
            setTranscriptBoxOpen={setTranscriptBoxOpen}
          />
        </Collapse>
      </Box>
    </Box>
  );
}
