import {
  FormatListBulletedOutlined,
  OndemandVideoOutlined,
  SubtitlesOutlined,
} from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { Box, Skeleton, Tab } from "@mui/material";
import { SetStateAction, Suspense } from "react";
import { MobileMainContainer } from "./MobileMainContainer";

export function MobileMainContainerFallback() {
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
      <TabContext value={""}>
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
              <TabList aria-label="lab API tabs example">
                <Tab label="" icon={<OndemandVideoOutlined />} value="1" />
                <Tab label="" icon={<FormatListBulletedOutlined />} value="2" />
                <Tab label="" icon={<SubtitlesOutlined />} value="3" />
              </TabList>
            </Box>

            <Box flex={1} alignItems={"center"} overflow={"auto"}>
              <Skeleton
                variant={"rectangular"}
                height={"400px"}
                width={"100%"}
              />
            </Box>
          </Box>
        </Box>
      </TabContext>
    </Box>
  );
}

export function MobileMainContainerSuspense({
  children,
  width,
  setWidth,
  roomId,
}: {
  children: React.ReactElement;
  width: number;
  setWidth: React.Dispatch<SetStateAction<number>>;
  roomId: string;
}): React.ReactElement {
  return (
    <Suspense fallback={<MobileMainContainerFallback />}>
      <MobileMainContainer width={width} setWidth={setWidth} roomId={roomId}>
        {children}
      </MobileMainContainer>
    </Suspense>
  );
}
