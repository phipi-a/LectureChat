import { PaletteMode } from "@mui/material";
import React from "react";

export const ColorModeContext = React.createContext({
  mode: "dark" as PaletteMode,
  setMode: (mode: PaletteMode) => {},
});
