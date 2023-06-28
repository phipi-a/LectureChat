"use client";
import { useEffect, useRef, useState } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import { Database } from "@/common/constants/supabaseTypes";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { CenteredLoading } from "@/common/components/general/CenteredLoading";
import { PdfBulletpointContainer } from "@/common/components/general/PdfBulletpointContainer";

// shortcut Database["public"]["Tables"]["data"]["Row"]

export default function Room({ params }: { params: { roomId: string } }) {
  const [data, setData] = useState<
    Database["public"]["Tables"]["data"]["Row"][]
  >([]);
  const dataRef = useRef(data);

  const { roomId } = params;
  const room = useGetData(
    [roomId, "room"],
    supabase.from("room_access").select("*").eq("room_id", roomId).single()
  );
  const initData = useGetData(
    [roomId, "initData"],
    supabase!
      .from("data")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true }),
    {
      onSuccess(
        data: PostgrestSingleResponse<
          Database["public"]["Tables"]["data"]["Row"][]
        >
      ) {
        if (data.error) {
          console.log("erro", data);
        } else {
          console.log("data", data);
          console.log("data.data", data.data);
          setData(data.data);
          dataRef.current = data.data;
        }
      },
    }
  );
  useEffect(() => {
    const channel = supabase!
      .channel("*")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "data",
          filter: "room_id=eq." + roomId,
        },

        (payload: any) => {
          if (payload.eventType === "DELETE") {
            console.log("Delete received!", payload);
            dataRef.current = dataRef.current.filter(
              (d) => d.id !== payload.old.id
            );
            setData([...dataRef.current]);
            return;
          }
          if (payload.eventType === "UPDATE") {
            console.log("Update received!", payload);
            dataRef.current = dataRef.current.map((d) => {
              if (d.id === payload.new.id) {
                return payload.new;
              }
              return d;
            });
            setData([...dataRef.current]);
            return;
          }
          if (payload.eventType === "INSERT") {
            console.log("Change received!", payload);
            dataRef.current.push(payload.new);
            setData([...dataRef.current]);
            if (livePageRef.current) {
              setPage(dataRef.current.at(-1)!.page!);
            }
            return;
          }
        }
      )
      .subscribe();
  }, [supabase, roomId]);
  const [page, setPage] = useState(1);
  function onPageManualChange(page: number) {
    setPage(page);
    setLivePage(false);
  }
  const [livePage, setLivePage] = useState(false);
  const livePageRef = useRef(livePage);
  if (initData.isLoading || room.isLoading) {
    return <CenteredLoading />;
  }
  return (
    <div>
      <h1>{room.data?.data?.room_title}</h1>
      <p>Room ID: {room.data?.data?.room_id}</p>
      <Typography variant="h4">Data</Typography>
      <Typography variant="body1">
        {data.map((d) => d.data).join(" ")}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => {
              setLivePage(e.target.checked);
              livePageRef.current = e.target.checked;
              if (e.target.checked) {
                setPage(data.at(-1)!.page!);
              }
            }}
            checked={livePage}
          />
        }
        label="PageSync"
      />
      <PdfBulletpointContainer
        roomId={roomId}
        page={page}
        setPage={onPageManualChange}
      />
    </div>
  );
}
