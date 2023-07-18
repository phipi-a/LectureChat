import { supabase } from "@/common/Modules/SupabaseClient";
import { QueryClient, useQuery } from "react-query";
import { useGetData2 } from "./supabaseData";

export const useUserData = (
  user_id: string | null,
  queryClient: QueryClient
) => {
  return useGetData2(
    ["userData", user_id],
    supabase.from("user").select("*").eq("id", user_id).single(),
    queryClient,
    {
      enabled: user_id !== null,
      suspense: true,
    }
  );
};

export const useTest = () => {
  return useQuery("test", async () => {
    return "test";
  });
};
