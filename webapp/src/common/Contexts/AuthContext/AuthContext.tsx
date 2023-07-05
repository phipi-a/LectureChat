import { Session } from "@supabase/supabase-js";
import React from "react";

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
