"use client";

import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { BulletPointI } from "@/common/Interfaces/Interfaces";
import {
  ChatOutlined,
  FormatListBulletedOutlined,
  OndemandVideoOutlined,
  SubtitlesOutlined,
} from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { BulletPoints } from "../../BulletPoints/BulletPoints";
import ChatSuspense from "../../Chat";
import "./style.css";

export function MobileMainContainer({
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
  const {
    segments,
    setCurrentPage,
    setPlayPosition,
    playPosition,
    currentPage,
  } = useContext(RoomContext);
  const [currentTab, setCurrentTab] = React.useState("1");
  const [chatBulletpoint, setChatBulletpoint] =
    React.useState<BulletPointI | null>(null);
  const [chatBulletPointId, setChatBulletPointId] = React.useState<number>(0);
  useEffect(() => {
    if (chatBulletpoint !== null) {
      setCurrentTab("4");
    }
  }, [chatBulletpoint]);

  useEffect(() => {
    setCurrentTab("1");
  }, [playPosition, currentPage]);
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
                <Tab label="" icon={<OndemandVideoOutlined />} value="1" />
                <Tab label="" icon={<FormatListBulletedOutlined />} value="2" />
                <Tab label="" icon={<SubtitlesOutlined />} value="3" />
                {chatBulletpoint ? (
                  <Tab label="" icon={<ChatOutlined />} value="4" />
                ) : null}
              </TabList>
            </Box>

            <Box flex={1} alignItems={"center"} overflow={"auto"}>
              <Box display={currentTab === "1" ? "block" : "none"}>
                {children}
              </Box>
              <Box mt={1} display={currentTab === "2" ? "block" : "none"}>
                <BulletPoints
                  roomId={roomId}
                  onOpenChat={(a, bulletpointId) => {
                    setChatBulletpoint({ ...a });
                    setChatBulletPointId(bulletpointId);
                  }}
                />
              </Box>
              <Box display={currentTab === "3" ? "block" : "none"}>
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
              </Box>
              <Box
                display={currentTab === "4" ? "block" : "none"}
                overflow={"auto"}
                height={"100%"}
              >
                <ChatSuspense
                  onClose={() => {
                    setChatBulletpoint(null);
                  }}
                  displayCloseButton={false}
                  bulletpoint={chatBulletpoint}
                  roomId={roomId}
                  bulletPointsId={chatBulletPointId}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </TabContext>
    </Box>
  );
}
