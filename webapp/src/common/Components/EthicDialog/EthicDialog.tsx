import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export function EthicDialog({ handleClose }: { handleClose: () => void }) {
  return (
    <>
      <DialogTitle>
        {<Typography variant="h5">⚠️ Warning</Typography>}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          This tool is powered by OpenAI's GPT-3.
          <br />
          <br />
          Cause of the nature of the tool, it is possible that the AI generates
          inappropriate or wrong content.
          <br />
          <br />
          Please use this tool with caution!!!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          I understand
        </Button>
      </DialogActions>
    </>
  );
}
