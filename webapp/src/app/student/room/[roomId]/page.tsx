"use client";
import Image from "next/image";
import styles from "./page.module.css";

import { useContext, useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import { CenteredLoading } from "@/common/components/CenteredLoading";
import { Database } from "@/common/constants/supabaseTypes";
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

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
    supabase!.from("data").select("*").eq("room_id", roomId),
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
            return;
          }
        }
      )
      .subscribe();
  }, [supabase, roomId]);
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
    </div>
  );
}
