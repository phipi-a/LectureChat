import { Send, SendOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@react-pdf-viewer/core";

export function Chat({ display }: { display: boolean }) {
  const messages = [
    {
      text: "Hey!",
      ai: true,
    },
    {
      text: "How are you?",
      ai: true,
    },
    {
      text: "I am fine, thanks",
      ai: false,
    },
    {
      text: "What about youd sflkd sfdask jdökasfjld ksj dskfjdsklfjdas?",
      ai: false,
    },
    {
      text: "Awesome!",
      ai: true,
    },
  ];
  if (!display) {
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
    >
      <Box flex={1} m={1}>
        <List>
          {messages.map((message, index) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: message.ai ? "flex-start" : "flex-end",
                mb: 1,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 1.3,
                  borderRadius: message.ai
                    ? "20px 20px 20px 5px"
                    : "20px 20px 5px 20px",
                }}
              >
                <Typography
                  variant="body2"
                  textAlign={message.ai ? "left" : "right"}
                >
                  {message.text}
                </Typography>
              </Paper>
            </Box>
          ))}
        </List>
      </Box>
      <TextField
        variant="standard"
        fullWidth
        label=""
        sx={{
          p: 1,
        }}
        InputProps={{
          endAdornment: (
            <IconButton>
              <Send color="primary" />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
}
