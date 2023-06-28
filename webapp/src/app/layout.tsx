"use client";
import {
  AppBar,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import "./globals.css";
import React from "react";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/common/context/AuthProvider";
import { OwnToolbar } from "@/common/components/general/OwnToolbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
    },
  });
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const router = useRouter();

  return (
    <html
      lang="en"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <head>
        <title>LectureChat</title>
      </head>
      <body
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <AuthProvider>
                <AppBar position="sticky">
                  <OwnToolbar />
                </AppBar>
                <Box
                  sx={{
                    my: 2,
                    m: 0,
                    p: 2,
                    maxWidth: "undefined",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                  }}
                >
                  {children}
                </Box>
              </AuthProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
