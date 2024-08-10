import { Database } from "~/types/supabase.types";

export type BoardType = Database["public"]["Tables"]["rooms"]["Row"]["board"];
