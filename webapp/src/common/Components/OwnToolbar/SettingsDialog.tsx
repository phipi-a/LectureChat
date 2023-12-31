"use client";
import { AuthContext } from "@/common/Contexts/AuthContext/AuthContext";
import { supabase } from "@/common/Modules/SupabaseClient";
import {
  useTriggerFunction,
  useUpsertData,
} from "@/utils/supabase/supabaseData";
import { useUserData } from "@/utils/supabase/supabaseQuery";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import Link from "@/common/Components/Link";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useContext, useState } from "react";
import { useQueryClient } from "react-query";

export function SettingsDialog({ closeDialog }: { closeDialog: () => void }) {
  const { session, userId } = useContext(AuthContext);
  const [showOpenAiApiKey, setShowOpenAiApiKey] = useState(false);

  const queryClient = useQueryClient();

  const [userData, setUserData] = useUserData(userId, queryClient);

  const [whisperUrl, setWhisperUrl] = useState<string | null | undefined>(
    userData?.data?.data?.whisper_url
  );
  const [openAiApiKey, setOpenAiApiKey] = useState<string | null | undefined>(
    userData?.data?.data?.openai_key
  );
  const [email, setEmail] = useState<string>("");
  const upsertUserSettings = useUpsertData(supabase.from("user"), {
    onSuccess: (res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("Settings saved", {
        variant: "success",
      });
      closeDialog();
      setUserData({
        id: userId!,
        whisper_url: whisperUrl?.endsWith("/")
          ? whisperUrl.slice(0, -1)
          : whisperUrl,
        openai_key: openAiApiKey!,
        created_at: userData?.data?.data?.created_at,
      });
    },
  });
  const deleteAccount = useTriggerFunction(supabase.rpc("deleteUser"), {
    onSuccess: (res) => {
      if (res.error) {
        enqueueSnackbar(res.error.message, {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("Account deleted", {
        variant: "success",
      });
      queryClient.invalidateQueries();
    },
  });
  function onSaveClick() {
    upsertUserSettings.mutate({
      id: userId!,
      whisper_url: whisperUrl?.endsWith("/")
        ? whisperUrl.slice(0, -1)
        : whisperUrl,
      openai_key: openAiApiKey,
    });
  }
  function onDeleteAccoutClick() {
    if (email !== session?.user?.email) {
      enqueueSnackbar("Email does not match", {
        variant: "error",
      });
      closeDialog();
      return;
    }
    deleteAccount.mutate({ field: "id", value: session?.user?.id });
    supabase.auth.signOut().then(() => {});
    closeDialog();
  }

  return (
    <>
      <DialogTitle>{"Settings"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="name"
          label="whisper URL"
          type="text"
          value={whisperUrl}
          onChange={(e) => {
            setWhisperUrl(e.target.value);
          }}
          fullWidth
          disabled={upsertUserSettings.isLoading}
        />
        <TextField
          margin="dense"
          id="name"
          label="OpenAi API Key"
          value={openAiApiKey}
          disabled={upsertUserSettings.isLoading}
          onChange={(e) => {
            setOpenAiApiKey(e.target.value);
          }}
          type={showOpenAiApiKey ? "text" : "password"}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowOpenAiApiKey(!showOpenAiApiKey);
                  }}
                >
                  {showOpenAiApiKey ? (
                    <VisibilityOffOutlined />
                  ) : (
                    <VisibilityOutlined />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div>
          <Link
            href="setup"
            style={{
              color: "grey",
              textDecoration: "none",
            }}
            onClick={() => {
              closeDialog();
            }}
          >
            🛈 How to setup
          </Link>
        </div>

        <Button
          //logout
          variant="outlined"
          onClick={() => {
            closeDialog();
            supabase.auth.signOut().then(() => {
              enqueueSnackbar("You have been logged out", {
                variant: "success",
              });
            });
            queryClient.invalidateQueries();
          }}
          color="error"
          sx={{
            m: 1,
          }}
        >
          Logout
        </Button>
        <Accordion
          sx={{
            backgroundColor: "transparent",
            borderRadius: "5px",
          }}
        >
          <AccordionSummary
            sx={{
              color: "text.disabled",
            }}
          >
            Delete Account
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              variant="standard"
              label="Enter your Email to confirm"
              id="outlined-size-small"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              size="small"
            />

            <Button
              //logout
              variant="contained"
              color="error"
              sx={{
                m: 1,
              }}
              onClick={onDeleteAccoutClick}
            >
              Delete Account
            </Button>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="error">
          Close
        </Button>
        <LoadingButton
          loading={upsertUserSettings.isLoading}
          onClick={onSaveClick}
          color="primary"
          //
        >
          Save
        </LoadingButton>
      </DialogActions>
    </>
  );
}
