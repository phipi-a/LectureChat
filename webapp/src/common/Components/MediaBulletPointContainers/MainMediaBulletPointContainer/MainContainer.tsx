"use client";

import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { BulletPointI } from "@/common/Interfaces/Interfaces";
import {
  FormatListBulletedOutlined,
  SubtitlesOutlined,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography, useTheme } from "@mui/material";
import { Resizable } from "re-resizable";
import React, { useContext, useRef } from "react";
import { BulletPointsSuspense } from "../../BulletPoints/BulletPoints";
import ChatSuspense from "../../Chat";
import "./style.css";

export function MainContainer({
  children,
  width,
  setWidth,
  roomId,
}: {
  children: React.ReactNode;
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  roomId: string;
}) {
  const theme = useTheme();
  const { segments, setCurrentPage, setPlayPosition } = useContext(RoomContext);
  const [currentTab, setCurrentTab] = React.useState("1");
  const [chatBulletpoint, setChatBulletpoint] =
    React.useState<BulletPointI | null>(null);
  const [chatBulletPointId, setChatBulletPointId] = React.useState<number>(0);
  const refContainer = useRef<HTMLDivElement>(null);
  const refLeft = useRef<Resizable>(null);
  const refRight = useRef<Resizable>(null);
  const [width2, setWidth2] = React.useState<number>(200);
  const minWidth3 = 200;
  return (
    <Box
      overflow={"auto"}
      ref={refContainer}
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        flex: 1,

        flexDirection: "row",
        alignItems: "center",
      }}
      m={1}
    >
      <Resizable
        defaultSize={{
          width: width,
          height: "100%",
        }}
        maxWidth={
          refContainer.current && refRight.current
            ? refContainer.current.offsetWidth -
              (refRight.current.state.width as number) -
              minWidth3
            : "50%"
        }
        ref={refLeft}
        minWidth={"20%"}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: "3px solid ",
          borderColor: theme.palette.divider,
        }}
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
        <Box flex={1} p={1} mt={6} overflow={"auto"}>
          {children}
        </Box>
      </Resizable>

      <TabContext value={currentTab}>
        <Box
          p={1}
          overflow={"auto"}
          flex={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
          }}
        >
          <Box
            overflow={"auto"}
            height={"100%"}
            display={"flex"}
            flex={1}
            flexDirection={"column"}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(e, value) => {
                  setCurrentTab(value);
                }}
                aria-label="lab API tabs example"
              >
                <Tab label="" icon={<FormatListBulletedOutlined />} value="1" />
                <Tab label="" icon={<SubtitlesOutlined />} value="2" />
              </TabList>
            </Box>

            <Box flex={1} alignItems={"center"} overflow={"auto"}>
              <TabPanel value="1">
                <BulletPointsSuspense
                  roomId={roomId}
                  onOpenChat={(a, bulletpointId) => {
                    setChatBulletpoint(a);
                    setChatBulletPointId(bulletpointId);
                  }}
                />
              </TabPanel>
              <TabPanel value="2">
                <Typography variant="body2">
                  {segments.map((segment, index) => {
                    return (
                      <span
                        key={segment.id + segment.data}
                        id={segment.id}
                        className="text_select"
                        style={{
                          borderRadius: "5px",
                        }}
                        onClick={() => {
                          if (segment.video_start_ms !== null) {
                            setPlayPosition({
                              pos: segment.video_start_ms!,
                            });
                          } else if (segment.page !== null) {
                            setCurrentPage(segment.page!);
                          }
                        }}
                      >
                        {segment.data}
                        &lrm;
                      </span>
                    );
                  })}
                </Typography>
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </TabContext>
      <Resizable
        ref={refRight}
        defaultSize={{
          width: width2,
          height: "100%",
        }}
        maxWidth={
          refContainer.current && refLeft.current
            ? refContainer.current.offsetWidth -
              (refLeft.current.state.width as number) -
              minWidth3
            : "50%"
        }
        onResizeStop={(e, direction, ref, d) => {
          setWidth2(width2 - d.width);
        }}
        minWidth={290}
        style={{
          display: chatBulletpoint ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          borderLeft: "3px solid",
          borderColor: theme.palette.divider,
          overflow: "hidden",
        }}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <ChatSuspense
          onClose={() => {
            setChatBulletpoint(null);
          }}
          bulletpoint={chatBulletpoint}
          roomId={roomId}
          bulletPointsId={chatBulletPointId}
        />
      </Resizable>
    </Box>
  );
}
