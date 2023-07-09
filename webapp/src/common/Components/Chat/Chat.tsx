import { BulletPointI, ChatI, MessageI } from "@/common/Interfaces/Interfaces";
import { Database } from "@/common/Interfaces/supabaseTypes";
import { supabase } from "@/common/Modules/SupabaseClient";
import { useGetDataN } from "@/utils/supabase/supabaseData";
import { CloseOutlined, Send } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
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
  const [currentMessage, setCurrentMessage] = React.useState("");
  const [messages, setMessages] = React.useState<ChatI>({
    id: undefined,
    messages: [],
  });

  const messagesData = useGetDataN<
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
      console.log("data", data);
      const messages: MessageI[] = data.data!.content as unknown as MessageI[];

      return {
        id: data.data!.id,
        messages: messages,
      };
    },
    {
      onSuccess: (data) => {
        console.log("Chat: onSuccess", data);
      },
    }
  );
  useEffect(() => {
    if (messagesData.data === null) return;
    setMessages(messagesData.data!);
  }, [messagesData.data]);

  const mutation = useMutation({
    mutationFn: async (newMessage: MessageI) => {
      console.log("Creating new bullet points");
      messages.messages.push(newMessage);
      setMessages({ ...messages });
      setCurrentMessage("");
      console.log("messages", messages);

      return supabase.functions.invoke("chat", {
        body: {
          id: messages.id,
          room_id: roomId,
          messages: messages.messages,
          bulletpoint_id: bulletPointsId,
          single_bulletpoint_id: bulletpoint?.id,
        },
      });
    },
    onSuccess: (res) => {
      console.log("Chat: onSuccess", res);
      if (res.data === null) return;
      messages.messages.push(res.data);
      setMessages({ ...messages });
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
    console.log("scrollRef", scrollRef);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              {messages.messages.concat(loadingArray).map((message, index) => (
                <Box
                  key={message.content + index + bulletpoint.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.role === "assistant" ? "flex-start" : "flex-end",
                    mb: 1,
                  }}
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
                        {message.content}
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
              console.log(`Pressed keyCode ${ev.key}`);
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
