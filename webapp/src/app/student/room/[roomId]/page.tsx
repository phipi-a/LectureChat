"use client";
import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import { useGetData } from "@/utils/supabase/supabaseData";
import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useRef } from "react";

import { Database } from "@/common/Interfaces/supabaseTypes";
import dynamic from "next/dynamic";

const PdfBulletpointContainerSuspense = dynamic(
  () =>
    import(
      "@/common/Components/MediaBulletPointContainers/PdfBulletpointContainer"
    ),
  {
    ssr: false,
  }
);
const VideoBulletPointContainerSuspense = dynamic(
  () =>
    import(
      "@/common/Components/MediaBulletPointContainers/VideoBulletPointContainer"
    ),
  {
    ssr: false,
  }
);

export default function Room({ params }: { params: { roomId: string } }) {
  let table = "room_access";
  let field = "room_id";
  if (params.roomId === "000000") {
    table = "room";
    field = "id";
  }

  const getRoom = useGetData(
    [params.roomId, "room"],
    supabase.from(table).select("*").eq(field, params.roomId).single()
  );
  let room = {} as Database["public"]["Tables"]["room_access"]["Row"];

  if (params.roomId === "000000") {
    room.room_title = getRoom.data?.data?.title;
    room.room_is_video_room = getRoom.data?.data?.is_video_room;
    room.room_video_url = getRoom.data?.data?.video_url;
  } else {
    room = getRoom.data?.data;
  }
  const { segments, setSegments } = useContext(RoomContext);
  const getInitData = useGetData(
    [params.roomId, "initData"],
    supabase!
      .from("data")
      .select("*")
      .eq("room_id", params.roomId)
      .order("created_at", { ascending: true }),
    {}
  );
  useEffect(() => {
    console.log("set", getInitData.data?.data);
    setSegments(getInitData.data?.data!);
  }, [getInitData.data, setSegments]);
  console.log("segments", segments);
  const dataRef = useRef(segments);
  useEffect(() => {
    dataRef.current = segments;
  }, [segments]);
  useEffect(() => {
    const channel = supabase!
      .channel("*")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "data",
          filter: "room_id=eq." + params.roomId,
        },

        (payload: any) => {
          if (payload.eventType === "DELETE") {
            dataRef.current = dataRef.current.filter(
              (d) => d.id !== payload.old.id
            );
            setSegments([...dataRef.current]);
            return;
          }
          if (payload.eventType === "UPDATE") {
            dataRef.current = dataRef.current.map((d) => {
              if (d.id === payload.new.id) {
                return payload.new;
              }
              return d;
            });
            setSegments([...dataRef.current]);
            return;
          }
          if (payload.eventType === "INSERT") {
            dataRef.current.push(payload.new);
            setSegments([...dataRef.current]);

            return;
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [params.roomId, setSegments]);

  return (
    <Box display={"flex"} flexDirection={"column"} overflow={"auto"} flex={1}>
      <Typography variant={"h4"} mb={1} mx={2} mt={1}>
        {room.room_title}
      </Typography>
      <Box display={"flex"} flex={1} overflow={"auto"}>
        {room?.room_is_video_room ? (
          <VideoBulletPointContainerSuspense
            videoUrl={room!.room_video_url}
            roomId={params.roomId}
          />
        ) : (
          <PdfBulletpointContainerSuspense roomId={params.roomId} />
        )}
      </Box>
    </Box>
  );
}
