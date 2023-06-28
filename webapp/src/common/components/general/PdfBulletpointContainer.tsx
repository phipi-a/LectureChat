"use client";

import { Box } from "@mui/material";
import { Resizable } from "re-resizable";
import { PdfViewer } from "./PdfViewer";
import React, { useEffect } from "react";
import { supabase } from "../../modules/supabase/supabaseClient";

export function PdfBulletpointContainer({
  roomId,
  page,
  setPage,
}: {
  roomId: string;
  page: number;
  setPage: (page: number) => void;
}) {
  const [pdfBlob, setPdfBlob] = React.useState<any>(null);
  useEffect(() => {
    supabase.storage
      .from("pdf")
      .download(roomId + ".pdf")
      .then((res) => {
        console.log(res);
        var file = new File([res.data!], "test.pdf", {
          type: "application/pdf",
        });
        console.log(file);
        setPdfBlob(file);
        console.log(window.URL.createObjectURL(res.data!));
        setPdfBlob(
          URL.createObjectURL(
            new Blob([res.data!], { type: "application/pdf" })
          )
        );
      });
  }, []);
  const [width, setWidth] = React.useState(500);
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        width: "100%",
        flexDirection: "row",
      }}
    >
      <Resizable
        defaultSize={{
          width: width,
          height: "100%",
        }}
        maxWidth={"90%"}
        minWidth={"10%"}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        onResizeStop={(e, direction, ref, d) => {
          setWidth(width + d.width);
        }}
      >
        <Box flex={1}>
          {pdfBlob && (
            <PdfViewer
              file={pdfBlob}
              width={width}
              page={page}
              setPage={setPage}
            />
          )}
        </Box>
      </Resizable>
      <Box
        flex={1}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "3px",
            backgroundColor: "#1565c0",
            zIndex: 1,
            transform: "translateX(-1px)",
          }}
        ></Box>
        {/*
          example bullet point*/}
        <ul>
          <li>Bulletpoint 1 example</li>
          <li>Bulletpoint 2 example</li>
          <li>Bulletpoint 3 example</li>
        </ul>
      </Box>
    </Box>
  );
}
