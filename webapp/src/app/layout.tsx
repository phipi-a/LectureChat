"use client";
import CenteredLoading from "@/common/Components/CenteredLoading";
import OwnToolbar from "@/common/Components/OwnToolbar";
import { AuthProvider } from "@/common/Contexts/AuthContext/AuthProvider";
import { LoadingContext } from "@/common/Contexts/LoadingContext/LoadingContext";
import { LoadingProvider } from "@/common/Contexts/LoadingContext/LoadingProvider";
import LectureThemeProvider from "@/common/Contexts/ThemeContext/ThemeContextProvider";
import { AppBar, Box, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React, { useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("react-query/devtools/development").then((d) => ({
    // ---------------------------^^^^^^^^^
    default: d.ReactQueryDevtools,
  }))
);

function InnerLoadingLayout({ children }: { children: any }) {
  const { isPending } = useContext(LoadingContext);
  if (isPending) {
    return <CenteredLoading />;
  }
  return children;
}

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
        suspense: true,
      },
    },
  });

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
          overflow: "auto",
        }}
      >
        <LectureThemeProvider>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <LoadingProvider>
                <AuthProvider>
                  <AppBar position="sticky" color="secondary">
                    <OwnToolbar />
                  </AppBar>
                  <InnerLoadingLayout>
                    <Box
                      sx={{
                        my: 2,
                        m: 0,
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        minHeight: "0px",
                        flexDirection: "column",
                        overflow: "auto",
                      }}
                    >
                      {children}
                    </Box>
                  </InnerLoadingLayout>
                </AuthProvider>
              </LoadingProvider>
            </QueryClientProvider>
          </SnackbarProvider>
        </LectureThemeProvider>
      </body>
    </html>
  );
}
