"use client";
import React, { useEffect, useState } from "react";

import CenteredLoading from "@/common/Components/CenteredLoading";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { supabase } from "../../Modules/SupabaseClient";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [event, setEvent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (window.location.href.includes("type=signup")) {
      enqueueSnackbar("Email Successfully Verified!", {
        variant: "success",
      });
      console.log("signup");
      window.location.replace("https://lecture-chat.vercel.app/signin");
    }
  }, []);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((error) => {});

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setEvent(event);
    });
  }, [supabase, supabase.auth]);
  console.log(session);

  console.log(event);

  if (session === undefined) return <CenteredLoading />;
  else {
    return (
      <AuthContext.Provider
        value={{
          session: session,
          event: event,
          loggedIn: session !== null,
          userId: session?.user.id || null,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
};
