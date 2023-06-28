import { createClient } from "@supabase/supabase-js";
import { Database } from "../../constants/supabaseTypes";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseStorageURL = `${supabaseUrl}/storage/v1/upload/resumable`;

export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {});
