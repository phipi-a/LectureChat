"use client";
import { Database } from "@/common/Interfaces/supabaseTypes";
import React from "react";

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
