"use client";
import React, { useState } from "react";

import { BulletPointsI } from "@/common/Interfaces/Interfaces";
import { Database } from "../../Interfaces/supabaseTypes";
import { RoomContext } from "./RoomContext";

export const RoomProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [segments, setSegments] = useState<
    Database["public"]["Tables"]["data"]["Row"][]
  >([]);
  const [bullet_points, setBulletPoints] = useState<BulletPointsI | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [playPosition, setPlayPosition] = useState<{ pos: number }>({ pos: 0 });
  console.log("roomProvider", segments);
  return (
    <RoomContext.Provider
      value={{
        segments,
        setSegments,
        currentPage,
        setCurrentPage,
        playPosition,
        setPlayPosition,
        bullet_points,
        setBulletPoints,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
