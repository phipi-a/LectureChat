import { BulletPointI } from "@/common/Interfaces/Interfaces";
import { CloseOutlined, Send } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  Paper,
  Skeleton,
  TextField,
} from "@mui/material";
import { Suspense } from "react";
import { Chat } from "./Chat";

export function ChatFallback() {
  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"} p={3}>
      <Box display={"flex"} alignItems={"center"} justifyContent={"flex-end"}>
        <IconButton disabled>
          <CloseOutlined />
        </IconButton>
      </Box>
      <Box overflow={"auto"} height={"100%"} flex={1} display={"flex"}>
        <Box
          maxHeight={"600px"}
          flex={1}
          height={"100%"}
          display={"flex"}
          border={"1px solid"}
          borderColor={"primary.main"}
          borderRadius={"10px"}
          flexDirection={"column"}
          overflow={"auto"}
        >
          <Box flex={1} m={1}>
            <List>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  mb: 1,
                  width: "100%",
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.3,
                    borderRadius: "20px 20px 20px 5px",
                    width: "100%",
                  }}
                >
                  <Skeleton variant="text" width={"100%"} />
                  <Skeleton variant="text" width={"80%"} />
                </Paper>
              </Box>
            </List>
          </Box>
          <TextField
            variant="standard"
            fullWidth
            disabled
            label=""
            sx={{
              p: 1,
            }}
            InputProps={{
              endAdornment: (
                <IconButton disabled>
                  <Send />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
export function ChatSuspense({
  onClose,
  bulletpoint,
  bulletPointsId,
  roomId,
}: {
  onClose: () => void;
  bulletpoint: BulletPointI | null;
  bulletPointsId: number;
  roomId: string;
}) {
  return (
    <Suspense fallback={<ChatFallback />}>
      <Chat
        onClose={onClose}
        bulletpoint={bulletpoint}
        bulletPointsId={bulletPointsId}
        roomId={roomId}
      />
    </Suspense>
  );
}
