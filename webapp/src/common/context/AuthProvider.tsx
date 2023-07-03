"use client";
import React, { useEffect, useState } from "react";

import { Session } from "@supabase/supabase-js";
import { CenteredLoading } from "../components/general/CenteredLoading";
import { supabase } from "../modules/supabase/supabaseClient";
export const AuthContext = React.createContext<{
  session: Session | null;
  loggedIn: boolean;
  userId: string | null;
  event: String | null;
}>({
  session: null,
  loggedIn: false,
  userId: null,
  event: null,
});
export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [event, setEvent] = useState<string | null>(null);

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
  }, []);

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
