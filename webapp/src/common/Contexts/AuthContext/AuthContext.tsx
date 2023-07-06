import { Session } from "@supabase/supabase-js";
import React from "react";
import { Database } from "../../Interfaces/supabaseTypes";

export const AuthContext = React.createContext<{
  session: Session | null;
  loggedIn: boolean;
  userId: string | null;
  event: String | null;
  userData: Database["public"]["Tables"]["user"]["Insert"] | null;
}>({
  session: null,
  loggedIn: false,
  userId: null,
  event: null,
  userData: null,
});
