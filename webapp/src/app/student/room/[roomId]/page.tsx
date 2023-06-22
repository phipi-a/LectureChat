"use client";
import Image from "next/image";
import styles from "./page.module.css";
import useLocalStorage from "use-local-storage";
import { useContext, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useGetData } from "@/lib/utils/supabase/supabaseData";
import { supabase } from "@/common/modules/supabase/supabaseClient";
import { CenteredLoading } from "@/common/components/CenteredLoading";

export default function Room({ params }: { params: { roomId: string } }) {
  const [data, setData] = useState<any>("");
  const { roomId } = params;
  const initData = useGetData(
    [roomId, "initData"],
    supabase!.from("data").select("*").eq("room_id", roomId).single(),
    {
      onSuccess(data) {
        console.log(data);
        if (data.error) {
          console.log("erro", data);
        } else {
          setData(data?.data?.data);
        }
      },
      onError(error) {
        console.log(error);
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
          setData(payload.new.data);
          console.log(payload.new.data);
        }
      )
      .subscribe();
  }, [supabase, roomId]);
  if (initData.isLoading) {
    return <CenteredLoading />;
  }
  return (
    <div>
      <h1>Test</h1>
      <p>Room ID: {params.roomId}</p>
      <Typography variant="h4">Data</Typography>
      <Typography variant="body1">{data}</Typography>
    </div>
  );
}
