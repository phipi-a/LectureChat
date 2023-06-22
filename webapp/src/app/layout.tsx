"use client";
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import "./globals.css";
import { Inter } from "next/font/google";
import React from "react";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/common/context/AuthProvider";
import { Toolbar } from "@/common/components/Toolbar";

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
                  <Toolbar />
                </AppBar>
                <Container
                  sx={{
                    my: 2,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                  }}
                >
                  {children}
                </Container>
              </AuthProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
