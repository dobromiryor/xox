import { generateSlug } from "random-word-slugs";
import { BOARD } from "~/consts/board.const";
import { useNameStore } from "~/stores/name.store";
import { useRoomStore } from "~/stores/room.store";
import { supabase } from "~/supabase/supabaseClient";
import { InsertRoom, UpdateRoom } from "~/types/room.types";

export const insertRoom = async (
  payload?: InsertRoom,
  { syncData } = { syncData: true }
) => {
  const nameStore = useNameStore();
  const roomStore = useRoomStore();

  roomStore.isLoading = true;

  const { data } = await supabase
    .from("rooms")
    .insert({
      room_name: generateSlug(),
      board: BOARD,
      ...(payload ? { ...payload } : { x: nameStore.name }),
    })
    .select()
    .limit(1)
    .single();

  if (data) {
    if (syncData) {
      roomStore.setDataFromResponse(data);
    }
  }

  return { data };
};

export const findRoomByName = async (
  room_name: string,
  { syncData } = { syncData: true }
) => {
  const roomStore = useRoomStore();

  roomStore.isLoading = true;

  const { data } = await supabase
    .from("rooms")
    .select()
    .eq("room_name", room_name)
    .maybeSingle();

  if (syncData) {
    roomStore.setDataFromResponse(data);
  }

  return { data };
};

export const updateRoomByName = async (
  room_name: string,
  payload: UpdateRoom,
  { syncData } = { syncData: true }
) => {
  const roomStore = useRoomStore();

  roomStore.isLoading = true;

  const { data } = await supabase
    .from("rooms")
    .update(payload)
    .eq("room_name", room_name)
    .select()
    .single();

  if (syncData) {
    roomStore.setDataFromResponse(data);
  }

  return { data };
};

export const deleteRoom = async (
  room_name: string,
  { syncData } = { syncData: true }
) => {
  const roomStore = useRoomStore();

  roomStore.isLoading = true;

  await supabase.from("rooms").delete().eq("room_name", room_name);

  if (syncData) {
    roomStore.$reset();
  }
};
