import { Database } from "~/types/supabase.types";

export type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];

export type InsertRoom = Omit<
	Database["public"]["Tables"]["rooms"]["Insert"],
	"room_name" | "board"
>;

export type UpdateRoom = Omit<
	Database["public"]["Tables"]["rooms"]["Update"],
	"id" | "created_at" | "room_name"
>;
