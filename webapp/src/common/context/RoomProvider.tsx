"use client";
import React, { useEffect, useMemo, useState } from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "../modules/supabase/supabaseClient";
import { CenteredLoading } from "../components/general/CenteredLoading";
import { Database } from "../constants/supabaseTypes";

export const RoomContext = React.createContext<{
  segments: Database["public"]["Tables"]["data"]["Row"][];
  setSegments: (
    segments: Database["public"]["Tables"]["data"]["Row"][]
  ) => void;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  playPosition: { pos: number };
  setPlayPosition: ({ pos }: { pos: number }) => void;
}>({
  segments: [],
  setSegments: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  playPosition: { pos: 0 },
  setPlayPosition: () => {},
});
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
