import { Box, Collapse, Skeleton } from "@mui/material";
import { Suspense } from "react";
import { VideoTranscriptionBox } from "./VideoTranscriptionBox";

export function VideoTranscriptionBoxFallback() {
  return (
    <Box display={"flex"} justifyContent={"end"} mx={5} flexDirection={"row"}>
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
      >
        <Collapse
          in={true}
          collapsedSize={"2em"}
          sx={{
            width: "100%",
          }}
        >
          <Skeleton variant={"text"} width={"100%"} />
        </Collapse>
      </Box>
    </Box>
  );
}
export function VideoTranscriptionBoxSuspense({
  roomId,
}: {
  roomId: string;
}): React.ReactElement {
  return (
    <Suspense fallback={<VideoTranscriptionBoxFallback />}>
      <VideoTranscriptionBox roomId={roomId} />
    </Suspense>
  );
}
