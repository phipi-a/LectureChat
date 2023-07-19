"use client";
import React, { useEffect, useState } from "react";

import CenteredLoading from "@/common/Components/CenteredLoading";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../Modules/SupabaseClient";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [event, setEvent] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.href.includes("type=signup")) {
      console.log("signup");
      setSession(null);
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
