"use client";

import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import {
  useDeleteData,
  useGetData,
  useInsertSelectData,
  useUpsertData,
} from "@/utils/supabase/supabaseData";
import { Box, Collapse } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { TranscriptionEditBox } from "../TranscriptionEditBox/TranscriptionEditBox";

export function VideoTranscriptionBox({ roomId }: { roomId: string }) {
  const [transcriptBoxOpen, setTranscriptBoxOpen] = React.useState(false);
  const { segments, setSegments } = useContext(RoomContext);

  const getInitData = useGetData(
    ["host", "room", roomId, "initData"],
    supabase.from("data").select("*").eq("room_id", roomId)
  );
  useEffect(() => {
    setSegments(getInitData.data?.data || []);
  }, [getInitData.data?.data]);
  //const [data, setData] = React.useState<any[]>(getInitData.data?.data || []);

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
  //wait for segments are set

  return (
    <Box
      display={"flex"}
      justifyContent={"end"}
      mx={2}
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
          p: 1,
        }}
        flex={1}
        onClick={
          transcriptBoxOpen ? undefined : () => setTranscriptBoxOpen(true)
        }
      >
        <Collapse in={transcriptBoxOpen} collapsedSize={"2em"}>
          <TranscriptionEditBox
            editable={true}
            enableDeleteAll={false}
            alignText="left"
            rawData={segments!}
            videoMode={true}
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
