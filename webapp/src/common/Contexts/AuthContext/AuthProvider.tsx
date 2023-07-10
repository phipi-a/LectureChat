"use client";
import React, { useEffect, useState } from "react";

import CenteredLoading from "@/common/Components/CenteredLoading";
import { useGetData } from "@/utils/supabase/supabaseData";
import { PostgrestSingleResponse, Session } from "@supabase/supabase-js";
import { useQueryClient } from "react-query";
import { supabase } from "../../Modules/SupabaseClient";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [event, setEvent] = useState<string | null>(null);

  const userData = useGetData(
    ["userData", session?.user?.id],
    supabase.from("user").select("*").single(),
    {
      enabled: session?.user?.id !== undefined,
      suspense: true,
    }
  );
  const queryClient = useQueryClient();
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

  if (session === undefined || (session !== null && userData.isLoading))
    return <CenteredLoading />;
  else {
    let data = null;
    if (userData.data?.data) {
      data = userData.data?.data;
    } else if (session?.user?.id) {
      data = {
        id: session?.user?.id,
        whisper_url: "",
        openai_key: "",
      };
    }

    return (
      <AuthContext.Provider
        value={{
          session: session,
          event: event,
          loggedIn: session !== null,
          userId: session?.user.id || null,
          setUserData: (newUserData) => {
            queryClient.setQueryData(["userData", session?.user?.id], {
              data: newUserData,
            } as PostgrestSingleResponse<any>);
          },
          userData: data,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
};
