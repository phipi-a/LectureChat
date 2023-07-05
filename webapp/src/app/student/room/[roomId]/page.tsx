"use client";
import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import { useGetData } from "@/utils/supabase/supabaseData";
import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useRef } from "react";

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
  const getRoom = useGetData(
    [params.roomId, "room"],
    supabase
      .from("room_access")
      .select("*")
      .eq("room_id", params.roomId)
      .single()
  );

  const room = getRoom.data?.data!;

  const getInitData = useGetData(
    [room.room_id, "initData"],
    supabase!
      .from("data")
      .select("*")
      .eq("room_id", room.room_id)
      .order("created_at", { ascending: true })
  );
  useEffect(() => {
    setSegments(getInitData.data?.data || []);
  }, [getInitData.data?.data]);
  const { segments, setSegments } = useContext(RoomContext);
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
          filter: "room_id=eq." + room.room_id,
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
  }, [supabase, room.room_id]);

  return (
    <>
      {room?.room_is_video_room ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          overflow={"auto"}
          flex={1}
        >
          <Typography variant={"h4"}>
            {room.room_title} ({room.room_id})
          </Typography>
          <Box display={"flex"} flex={1} overflow={"auto"}>
            <VideoBulletPointContainerSuspense
              videoUrl={room!.room_video_url}
              roomId={params.roomId}
            />
          </Box>
        </Box>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          flex={1}
          overflow={"auto"}
        >
          <Typography variant={"h4"}>
            {room?.room_title} ({room?.room_id})
          </Typography>

          <PdfBulletpointContainerSuspense roomId={params.roomId} />
        </Box>
      )}
    </>
  );
}
