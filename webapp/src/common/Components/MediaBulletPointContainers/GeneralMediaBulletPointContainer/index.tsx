import { useMediaQuery, useTheme } from "@mui/material";
import { SetStateAction } from "react";
import MainContainerSuspense from "../MainMediaBulletPointContainer";
import MobileMainContainerSuspense from "../MobileMainMediaBulletPointContainer";

export default function GeneralMainContainerSuspense({
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
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("md"));
  if (window.matchMedia("(pointer: coarse)").matches || xs) {
    return (
      <MobileMainContainerSuspense
        width={width}
        setWidth={setWidth}
        roomId={roomId}
      >
        {children}
      </MobileMainContainerSuspense>
    );
  } else {
    return (
      <MainContainerSuspense width={width} setWidth={setWidth} roomId={roomId}>
        {children}
      </MainContainerSuspense>
    );
  }
}
