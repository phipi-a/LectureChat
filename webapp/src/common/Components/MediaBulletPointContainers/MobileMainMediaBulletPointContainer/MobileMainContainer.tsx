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
import Joyride, { Step } from "react-joyride";
import { BulletPointsSuspense } from "../../BulletPoints/BulletPoints";
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
  const steps: Step[] = [
    {
      target: ".mainbody",
      content:
        "Welcome to the demo room! Let us guide you through the key features.",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".showbulletpointsbutton",
      content: "Click here to see the generated bullet points",
      disableBeacon: true,
    },
    {
      target: ".showchatbutton",
      content: "Click here to chat about the bullet point",
    },
    {
      target: ".chatbox",
      content: "Type your message here",
    },
    {
      target: ".showvideosubtitlesbutton",
      content: "Click here to see the video subtitles",
    },
    {
      target: ".jumptoposition",
      content: "Click here to jump to the position of the video",
    },
    {
      target: ".jumptopositionbulletpoint",
      content: "You can click on the bullet point to jump to the position",
    },
  ];
  const [run, setRun] = React.useState(true);
  const [stepIndex, setStepIndex] = React.useState(0);
  return (
    <Box
      overflow={"auto"}
      className={"mainbody"}
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
            <Box
              sx={{ borderBottom: 1, borderColor: "divider" }}
              overflow={"auto"}
            >
              <TabList
                variant="scrollable"
                onChange={(e, value) => {
                  setCurrentTab(value);
                }}
                aria-label="lab API tabs example"
              >
                <Tab
                  label={<span style={{ fontSize: "0.7rem" }}>Video</span>}
                  icon={<OndemandVideoOutlined />}
                  value="1"
                />
                <Tab
                  label={
                    <span style={{ fontSize: "0.7rem" }}>Bullet Points</span>
                  }
                  icon={<FormatListBulletedOutlined />}
                  value="2"
                  className="showbulletpointsbutton"
                />
                <Tab
                  label={<span style={{ fontSize: "0.7rem" }}>Subtitles</span>}
                  icon={<SubtitlesOutlined />}
                  value="3"
                  className="showvideosubtitlesbutton"
                />
                {chatBulletpoint ? (
                  <Tab
                    label={<span style={{ fontSize: "0.7rem" }}>Chat</span>}
                    icon={<ChatOutlined />}
                    value="4"
                  />
                ) : null}
              </TabList>
            </Box>

            <Box flex={1} alignItems={"center"} overflow={"auto"}>
              <Box display={currentTab === "1" ? "block" : "none"}>
                {children}
              </Box>
              <Box mt={1} display={currentTab === "2" ? "block" : "none"}>
                <BulletPointsSuspense
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
                        className={
                          index !== 4
                            ? "text_select"
                            : "text_select jumptoposition"
                        }
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

      {roomId === "000000" && (
        <Joyride
          steps={steps}
          continuous={true}
          run={run}
          disableCloseOnEsc={true}
          stepIndex={stepIndex}
          styles={{
            options: {
              arrowColor: "#fff",
              backgroundColor: "#fff",
              primaryColor: "#000",
              width: 900,
              zIndex: 1000,
            },
          }}
          disableOverlayClose={true}
          disableScrolling={true}
          hideBackButton={true}
          hideCloseButton={true}
          callback={(data) => {
            if (data.action === "next" && data.type === "step:after") {
              setStepIndex(data.index + 1);

              if ([1, 2, 4].includes(data.index)) {
                setRun(false);
                (
                  document.querySelector(
                    data.step?.target as string
                  )! as HTMLElement
                ).click();
                setTimeout(() => {
                  setRun(true);
                }, 300);
              }
              if (5 === data.index) {
                setRun(false);
                (
                  document.querySelector(
                    steps[1].target as string
                  )! as HTMLElement
                ).click();
                setTimeout(() => {
                  setRun(true);
                }, 300);
              }
            }
          }}
        />
      )}
    </Box>
  );
}
