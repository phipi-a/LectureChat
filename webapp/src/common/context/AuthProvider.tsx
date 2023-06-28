"use client";
import React, { useEffect, useMemo, useState } from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "../modules/supabase/supabaseClient";
import { CenteredLoading } from "../components/general/CenteredLoading";
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
      .catch((error) => {
        console.log(error);
      });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setEvent(event);
    });
  }, []);
  console.log(session);
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
