"use client";
import EthicDialog from "@/common/Components/EthicDialog";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import { useGetData } from "@/utils/supabase/supabaseData";
import { Dialog } from "@mui/material";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";
import "./page.css";

const HostRoomHeader = dynamic(
  () => import("@/common/PageComponents/host/room/[roomId]/_page/Header"),
  {
    ssr: false,
  }
);

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

const LiveAudioTranscriptionBoxSuspense = dynamic(
  () =>
    import(
      "@/common/PageComponents/host/room/[roomId]/_page/LiveAudioTranscriptionBox"
    ),
  {
    ssr: false,
  }
);
const VideoTranscriptionBoxSuspense = dynamic(
  () =>
    import(
      "@/common/PageComponents/host/room/[roomId]/_page/VideoTranscriptionBox"
    ),
  {
    ssr: false,
  }
);

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
      <Box display={"flex"} flexDirection={"column"} flex={1} overflow={"auto"}>
        <HostRoomHeader
          title={room!.title}
          roomId={room!.id}
          password={room!.password}
        />
        {room?.is_video_room ? (
          <>
            <VideoTranscriptionBoxSuspense roomId={params.roomId} />
            <VideoBulletPointContainerSuspense
              videoUrl={room!.video_url}
              roomId={params.roomId}
            />
          </>
        ) : (
          <>
            <LiveAudioTranscriptionBoxSuspense roomId={params.roomId} />
            <PdfBulletpointContainerSuspense roomId={params.roomId} />
          </>
        )}
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
