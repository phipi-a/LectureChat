"use client";
import Image from "next/image";
import styles from "./page.module.css";
import useLocalStorage from "use-local-storage";
import { useContext } from "react";
import { TextField } from "@mui/material";
import {
  useGetData,
  useInsertData,
  useUpsertData,
} from "@/lib/utils/supabase/supabaseData";
import { supabase } from "@/common/modules/supabase/supabaseClient";

export default function Room({ params }: { params: { roomId: string } }) {
  const getRoom = useGetData(
    ["host", "room", params.roomId],
    supabase.from("room").select("*").eq("id", params.roomId).single()
  );
  const getInitData = useGetData(
    ["host", "room", params.roomId, "initData"],
    supabase.from("data").select("*").eq("room_id", params.roomId).single()
  );

  const insertData = useUpsertData(supabase.from("data"));
  function onDataChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    insertData.mutate({
      room_id: params.roomId,
      data: event.target.value,
    });
  }
  if (getRoom.isLoading || getInitData.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>HostROOM</h1>

      <p>Room ID: {params.roomId}</p>
      <p>Password: {getRoom.data?.data?.password} </p>
      <TextField
        id="outlined-basic"
        label="Data"
        variant="standard"
        onChange={onDataChange}
        minRows={5}
        defaultValue={getInitData.data?.data?.data}
        multiline
      ></TextField>
    </div>
  );
}
