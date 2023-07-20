"use client";
import EthicDialog from "@/common/Components/EthicDialog";
import PdfBulletpointContainerSuspense from "@/common/Components/MediaBulletPointContainers/PdfBulletpointContainer";
import VideoBulletPointContainerSuspense from "@/common/Components/MediaBulletPointContainers/VideoBulletPointContainer";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import HostRoomHeader from "@/common/PageComponents/host/room/[roomId]/_page/Header";
import LiveAudioTranscriptionBoxSuspense from "@/common/PageComponents/host/room/[roomId]/_page/LiveAudioTranscriptionBox";
import VideoTranscriptionBoxSuspense from "@/common/PageComponents/host/room/[roomId]/_page/VideoTranscriptionBox";
import { useGetData } from "@/utils/supabase/supabaseData";
import { Dialog } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import "./page.css";

export default function Room({ params }: { params: { roomId: string } }) {
  const [openWarning, setOpenWarning] = useState<boolean>(true);
  const { userId } = useContext(AuthContext);

  const getRoom = useGetData(
    ["host", "room", params.roomId],

    supabase
      .from("room")
      .select("*")
      .eq("id", params.roomId)
      .eq("user_id", userId)
      .single()
  );

  const room = getRoom.data?.data;

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"100%"}
        overflow={"auto"}
        className={"room"}
        flex={1}
        minHeight={0}
      >
        <HostRoomHeader
          title={room!.title}
          roomId={room!.id}
          password={room!.password}
        />
        <Box
          display={"flex"}
          overflow={"auto"}
          width={"100%"}
          flex={1}
          minHeight={0}
          flexDirection={"column"}
        >
          {room?.is_video_room ? (
            <>
              <VideoTranscriptionBoxSuspense roomId={params.roomId} />
              <Box
                display={"flex"}
                overflow={"auto"}
                width={"100%"}
                flex={1}
                minHeight={0}
                flexDirection={"column"}
              >
                <VideoBulletPointContainerSuspense
                  videoUrl={room!.video_url}
                  roomId={params.roomId}
                />
              </Box>
            </>
          ) : (
            <>
              <LiveAudioTranscriptionBoxSuspense roomId={params.roomId} />
              <PdfBulletpointContainerSuspense roomId={params.roomId} />
            </>
          )}
        </Box>
      </Box>
      <Dialog open={openWarning} fullWidth>
        <EthicDialog
          handleClose={function (): void {
            setOpenWarning(false);
          }}
        />
      </Dialog>
    </>
  );
}
