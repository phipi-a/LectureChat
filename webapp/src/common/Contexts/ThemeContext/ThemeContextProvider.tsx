import {
  PaletteMode,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { ColorModeContext } from "./ThemeContext";

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          secondary: {
            main: grey[200],
          },
        }
      : {}),
  },
});

const LectureThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemPreferredMode = useMediaQuery("(prefers-color-scheme: dark)")
    ? "dark"
    : "light";

  const [cookies, setCookie] = useCookies(["lecture_chat_theme"]);

  const [mode, setMode] = React.useState<PaletteMode>(systemPreferredMode);

  useEffect(() => {
    if (!cookies.lecture_chat_theme) {
      setMode(systemPreferredMode);
    } else {
      setMode(cookies.lecture_chat_theme);
    }
  }, [systemPreferredMode, cookies.lecture_chat_theme]);

  const colorMode = React.useMemo(
    () => ({
      mode: mode,
      setMode: (mode: PaletteMode) => {
        setCookie("lecture_chat_theme", mode);
        setMode(mode);
      },
    }),
    [mode, systemPreferredMode]
  );

  const theme = createTheme(getDesignTokens(mode));

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default LectureThemeProvider;
