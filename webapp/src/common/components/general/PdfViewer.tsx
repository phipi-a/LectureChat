"use client";
import React, { useCallback, useEffect } from "react";

import { pdfjs } from "react-pdf";

import { RoomContext } from "@/common/context/RoomProvider";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/cjs/Page/AnnotationLayer.css";
import "react-pdf/dist/cjs/Page/PageCanvas";
import "react-pdf/dist/cjs/Page/PageSVG";
import "react-pdf/dist/cjs/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
export function PdfViewer({ file, width }: { file: any; width: number }) {
  const { currentPage, setCurrentPage } = React.useContext(RoomContext);
  const [numPages, setNumPages] = React.useState(0);

  const pageRef = React.useRef(currentPage);
  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);
  function onDocumentLoadSuccess(pdf: { numPages: any }) {
    setNumPages(pdf.numPages);
  }

  const handleKeyPress = useCallback((event: { key: any }) => {
    if (event.key === "ArrowRight") {
      if (pageRef.current === numPages) return;
      pageRef.current = pageRef.current + 1;
      setCurrentPage(pageRef.current);
    }
    if (event.key === "ArrowLeft") {
      if (pageRef.current === 1) return;

      pageRef.current = pageRef.current - 1;
      setCurrentPage(pageRef.current);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <TextField
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">/{numPages}</InputAdornment>
          ),
          inputProps: {
            max: numPages,
            min: 1,
          },
        }}
        sx={{
          width: "5em",
        }}
        variant="standard"
        size="small"
        value={currentPage}
        onChange={(e) => {
          setCurrentPage(parseInt(e.target.value));
        }}
      ></TextField>
      <Box
        sx={{
          display: "absolute",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
        id="PdfDiv"
      >
        <Document
          file={file}
          loading={<></>}
          onLoadSuccess={onDocumentLoadSuccess}
          onError={console.error}
          onLoadError={console.error}
        >
          <Page
            pageNumber={currentPage}
            renderAnnotationLayer={false}
            width={width}
            onLoadError={console.error}
            canvasBackground="grey"
          />
        </Document>
      </Box>
    </Box>
  );
}
