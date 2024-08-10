import { generateSlug } from "random-word-slugs";
import { ref } from "vue";
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

  const isLoading = ref(true);

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

  isLoading.value = false;
  if (data) {
    if (syncData) {
      roomStore.setDataFromResponse(data);
    }

    return { data, isLoading: isLoading.value };
  }

  return { data: null, isLoading: isLoading.value };
};

export const findRoomByName = async (
  room_name: string,
  { syncData } = { syncData: true }
) => {
  const roomStore = useRoomStore();
  const isLoading = ref(true);

  const { data } = await supabase
    .from("rooms")
    .select()
    .eq("room_name", room_name)
    .maybeSingle();

  isLoading.value = false;

  if (syncData) {
    roomStore.setDataFromResponse(data);
  }

  return { data, isLoading: isLoading.value };
};

export const updateRoomByName = async (
  room_name: string,
  payload: UpdateRoom,
  { syncData } = { syncData: true }
) => {
  const roomStore = useRoomStore();
  const isLoading = ref(true);

  const { data } = await supabase
    .from("rooms")
    .update(payload)
    .eq("room_name", room_name)
    .select()
    .single();

  if (syncData) {
    roomStore.setDataFromResponse(data);
  }

  return { data, isLoading: isLoading.value };
};

export const deleteRoom = async (
  room_name: string,
  { syncData } = { syncData: true }
) => {
  const roomStore = useRoomStore();
  const isLoading = ref(true);

  await supabase.from("rooms").delete().eq("room_name", room_name);

  isLoading.value = false;

  if (syncData) {
    roomStore.$reset();
  }

  return { isLoading: isLoading.value };
};
