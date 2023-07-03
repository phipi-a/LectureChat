"use client";

import { RoomContext } from "@/common/context/RoomProvider";
import {
  FormatListBulletedOutlined,
  SubtitlesOutlined,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import { Resizable } from "re-resizable";
import React, { useContext } from "react";
import { Chat } from "./Chat";
import "./v.css";

export function MainContainer({
  children,
  width,
  setWidth,
}: {
  children: React.ReactNode;
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { segments, setCurrentPage, setPlayPosition } = useContext(RoomContext);
  const [currentTab, setCurrentTab] = React.useState("1");
  return (
    <Box
      overflow={"auto"}
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        flex: 1,

        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Resizable
        defaultSize={{
          width: width,
          height: "100%",
        }}
        maxWidth={"90%"}
        minWidth={"20%"}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
        <Box flex={1} pl={1} mt={6}>
          {children}
        </Box>
      </Resizable>
      <TabContext value={currentTab}>
        <Box
          overflow={"auto"}
          flex={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
          }}
        >
          <Box
            height={"100%"}
            sx={{
              width: "3px",
              backgroundColor: "#1565c0",
              zIndex: 1,
            }}
          ></Box>
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
                <ul>
                  <li>Bulletpoint 1 example</li>
                  <li>Bulletpoint 2 efasddsfadsfdsxample</li>
                  <li>Bulletpoint 3 example</li>
                </ul>
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
                            setPlayPosition({ pos: segment.video_start_ms! });
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
        <Chat display={false} />
      </TabContext>
    </Box>
  );
}
