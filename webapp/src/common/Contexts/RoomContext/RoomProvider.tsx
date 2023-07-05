"use client";
import React, { useState } from "react";

import { Database } from "../../Interfaces/supabaseTypes";
import { RoomContext } from "./RoomContext";

export const RoomProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [segments, setSegments] = useState<
    Database["public"]["Tables"]["data"]["Row"][]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [playPosition, setPlayPosition] = useState<{ pos: number }>({ pos: 0 });

  return (
    <RoomContext.Provider
      value={{
        segments,
        setSegments,
        currentPage,
        setCurrentPage,
        playPosition,
        setPlayPosition,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
