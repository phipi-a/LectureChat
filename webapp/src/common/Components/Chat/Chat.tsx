import { supabase } from "@/common/Modules/SupabaseClient";
import { Send } from "@mui/icons-material";
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
  init_bulletpoint,
  roomId,
}: {
  init_bulletpoint: string | null;
  roomId: string;
}) {
  const [currentMessage, setCurrentMessage] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      role: "user",
      content: "i want to talk about: " + init_bulletpoint,
    },
  ]);
  useEffect(() => {
    if (init_bulletpoint === null) {
      return;
    }
    setMessages([
      {
        role: "user",
        content: "i want to talk about: " + init_bulletpoint,
      },
    ]);
  }, [init_bulletpoint]);

  const mutation = useMutation({
    mutationFn: async (newMessage: any) => {
      console.log("Creating new bullet points");
      messages.push(newMessage);
      setMessages([...messages]);
      setCurrentMessage("");
      console.log("messages", messages);

      return supabase.functions.invoke("chat", {
        body: {
          room_id: roomId,
          messages: messages,
        },
      });
    },
    onSuccess: (res) => {
      console.log("Chat: onSuccess", res);
      if (res.data === null) return;
      messages.push(res.data);
      setMessages([...messages]);
    },
  });
  let loadingArray: { role: string; content: string }[] = [];
  if (mutation.isLoading) {
    loadingArray.push({
      role: "assistant",
      content: "Loading...",
    });
  }

  if (init_bulletpoint === null) {
    return <></>;
  }
  return (
    <Box
      width={"300px"}
      m={1}
      height={"500px"}
      display={"flex"}
      border={"1px solid"}
      borderColor={"primary.main"}
      borderRadius={"10px"}
      flexDirection={"column"}
      overflow={"auto"}
    >
      <Box flex={1} m={1}>
        <List>
          {messages.concat(loadingArray).map((message, index) => (
            <Box
              key={message.content}
              sx={{
                display: "flex",
                justifyContent:
                  message.role === "assistant" ? "flex-start" : "flex-end",
                mb: 1,
              }}
            >
              <Paper
                variant="outlined"
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
                    textAlign={message.role === "assistant" ? "left" : "right"}
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
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => {
                if (mutation.isLoading) return;
                const newMessage = {
                  role: "user",
                  content: currentMessage,
                };

                mutation.mutate(newMessage);
              }}
            >
              <Send color="primary" />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
}
