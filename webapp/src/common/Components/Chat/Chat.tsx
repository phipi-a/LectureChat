import { RoomContext } from "@/common/Contexts/RoomContext/RoomContext";
import { BulletPointI, ChatI, MessageI } from "@/common/Interfaces/Interfaces";
import { Database } from "@/common/Interfaces/supabaseTypes";
import { supabase } from "@/common/Modules/SupabaseClient";
import { time2sec } from "@/utils/helper";
import { useGetDataN2 } from "@/utils/supabase/supabaseData";
import { CloseOutlined, Send } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";

export function Chat({
  onClose,
  bulletpoint,
  bulletPointsId,
  roomId,
  displayCloseButton = true,
}: {
  onClose: () => void;
  bulletpoint: BulletPointI | null;
  bulletPointsId: number;
  roomId: string;
  displayCloseButton?: boolean;
}) {
  const { setPlayPosition, setCurrentPage } = useContext(RoomContext);
  const [currentMessage, setCurrentMessage] = React.useState("");
  const queryClient = useQueryClient();

  const [messagesData, setMessageData] = useGetDataN2<
    ChatI,
    Database["public"]["Tables"]["chat"]["Row"]
  >(
    ["chat", bulletpoint?.id, bulletPointsId],
    supabase
      .from("chat")
      .select("*")
      .eq("bulletpoint_id", bulletPointsId)
      .eq("single_bulletpoint_id", bulletpoint?.id)
      .single(),
    (data) => {
      if (data.data === null) {
        return {
          id: undefined,
          messages: [
            {
              role: "user",
              content: "i want to talk about: " + bulletpoint?.bullet_point,
            },
          ],
        };
      }

      const messages: MessageI[] = data.data!.content as unknown as MessageI[];

      return {
        id: data.data!.id,
        messages: messages,
      };
    },
    queryClient,
    {
      onSuccess: (data) => {},
      enabled: bulletPointsId !== undefined && bulletpoint?.id !== undefined,
    }
  );

  const mutation = useMutation({
    mutationFn: async (newMessage: MessageI) => {
      messagesData.data!.messages.push(newMessage);
      setMessageData({
        id: messagesData.data!.id,
        messages: messagesData.data!.messages,
      });
      setCurrentMessage("");

      return supabase.functions.invoke("chat", {
        body: {
          id: messagesData.data!.id,
          room_id: roomId,
          messages: messagesData.data!.messages,
          bulletpoint_id: bulletPointsId,
          single_bulletpoint_id: bulletpoint?.id,
        },
      });
    },
    onSuccess: (res) => {
      if (res.data === null) return;
      messagesData.data!.messages.push(res.data);
      setMessageData({
        id: messagesData.data!.id,
        messages: messagesData.data!.messages,
      });
    },
  });
  const scrollRef = React.useRef<HTMLDivElement>(null);
  let loadingArray: MessageI[] = [];
  if (mutation.isLoading) {
    loadingArray.push({
      role: "assistant",
      content: "Loading...",
    });
  }
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData.data?.messages]);

  if (bulletpoint === null) {
    return <></>;
  }
  function handleSendMessage() {
    if (mutation.isLoading) return;
    const newMessage: MessageI = {
      role: "user",
      content: currentMessage,
    };

    mutation.mutate(newMessage);
  }
  function replacePageLinks(message: string) {
    const reg = RegExp(/(\[[0-9][0-9]?[0-9]?])/g);
    const splits = message.split(reg);
    return splits.map((split, index) => {
      if (split.match(reg)) {
        return (
          <Link
            href="#"
            style={{
              color: "inherit",
            }}
            key={split + index}
            onClick={(e) => {
              setCurrentPage(parseInt(split.slice(1, split.length - 1)));
            }}
          >
            {split.slice(1, split.length - 1)}
          </Link>
        );
      }
      return <span key={split + index}>{split}</span>;
    });
  }

  function replaceTimestamps(message: string) {
    const reg = RegExp(/(\[[0-9]?[0-9]:[0-9]?[0-9]])/g);
    const splits = message.split(reg);
    return splits.map((split, index) => {
      if (split.match(reg)) {
        return (
          <Link
            href="#"
            style={{
              color: "inherit",
            }}
            key={split + index}
            onClick={(e) => {
              setPlayPosition({
                pos: time2sec(split.slice(1, split.length - 1)),
              });
            }}
          >
            {split.slice(1, split.length - 1)}
          </Link>
        );
      }
      return <span key={split + index}>{replacePageLinks(split)}</span>;
    });
  }

  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <Box
        display={displayCloseButton ? "flex" : "none"}
        alignItems={"center"}
        justifyContent={"flex-end"}
      >
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </Box>
      <Box overflow={"auto"} height={"100%"} flex={1} display={"flex"}>
        <Box
          flex={1}
          height={"100%"}
          display={"flex"}
          borderColor={"primary.main"}
          borderRadius={"10px"}
          flexDirection={"column"}
          overflow={"auto"}
        >
          <Box flex={1} m={1} overflow={"auto"}>
            <List>
              {messagesData
                .data!.messages.concat(loadingArray)
                .map((message, index) => (
                  <Box
                    key={message.content + index + bulletpoint.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        message.role === "assistant"
                          ? "flex-start"
                          : "flex-end",
                      mb: 1,
                    }}
                    onClick={() => {}}
                  >
                    <Paper
                      variant="outlined"
                      ref={scrollRef}
                      sx={{
                        p: 1.3,
                        borderRadius:
                          message.role === "assistant"
                            ? "20px 20px 20px 5px"
                            : "20px 20px 5px 20px",
                      }}
                    >
                      {message.content === "Loading..." ? (
                        <TypingIndicator />
                      ) : (
                        <Typography
                          variant="body2"
                          textAlign={
                            message.role === "assistant" ? "left" : "right"
                          }
                        >
                          {replaceTimestamps(message.content)}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                ))}
            </List>
          </Box>
          <TextField
            variant="standard"
            fullWidth
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
            label=""
            sx={{
              p: 1,
            }}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                handleSendMessage();
                ev.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSendMessage}>
                  <Send color="primary" />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
