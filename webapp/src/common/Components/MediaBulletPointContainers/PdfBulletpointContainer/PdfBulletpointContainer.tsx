"use client";

import { Box } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { supabase } from "../../../Modules/SupabaseClient";
import GeneralMainContainerSuspense from "../GeneralMediaBulletPointContainer";
import { PdfViewer } from "./PdfViewer";

export function PdfBulletpointContainerSuspense({
  roomId,
}: {
  roomId: string;
}) {
  async function downloadPDF() {
    const res = await supabase.storage.from("pdf").download(roomId + ".pdf");

    return URL.createObjectURL(
      new Blob([res.data!], { type: "application/pdf" })
    );
  }

  const pdfDownload = useQuery(["pdf", roomId], downloadPDF);

  const [width, setWidth] = React.useState(500);
  return (
    <GeneralMainContainerSuspense
      width={width}
      setWidth={setWidth}
      roomId={roomId}
    >
      <Box flex={1} height="100%" overflow={"auto"}>
        {pdfDownload.data && (
          <PdfViewer file={pdfDownload.data} width={width} />
        )}
      </Box>
    </GeneralMainContainerSuspense>
  );
}
