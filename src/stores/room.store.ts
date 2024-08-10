import { defineStore } from "pinia";
import { computed, Ref, ref } from "vue";
import { BOARD } from "~/consts/board.const";
import { Mark } from "~/enums/mark.enum";
import { useNameStore } from "~/stores/name.store";
import { BoardType } from "~/types/board.type";
import { Player } from "~/types/player.type";
import { Database } from "~/types/supabase.types";
import { getWinningLine } from "~/utils/getResult";

type ResultType = Database["public"]["Enums"]["result"];
type MarkType = Database["public"]["Enums"]["mark"];

export const useRoomStore = defineStore("room", () => {
  const nameStore = useNameStore();

  const id: Ref<number | undefined> = ref();
  const room_name: Ref<string | undefined> = ref();
  const x: Ref<string | null> = ref(null);
  const o: Ref<string | null> = ref(null);
  const turn: Ref<MarkType> = ref(Mark.X);
  const board: Ref<BoardType> = ref(BOARD);
  const result: Ref<ResultType | null> = ref(null);

  const players: Ref<Player[]> = ref([]);

  const player = computed(() =>
    players.value?.length > 0
      ? players.value?.find((player) => player.name === nameStore.name)
      : undefined
  );

  const opponent = computed(() =>
    players.value?.length > 0
      ? players.value?.find((player) => player.name !== nameStore.name)
      : undefined
  );

  const winningLine = computed(() => {
    const X = getWinningLine("X", board.value);
    const O = getWinningLine("O", board.value);

    return { X, O };
  });

  const $reset = () => {
    id.value = undefined;
    room_name.value = undefined;
    x.value = null;
    o.value = null;
    result.value = null;
    board.value = BOARD;
    turn.value = Mark.X;

    players.value = [];
  };

  const setDataFromResponse = (
    data: Database["public"]["Tables"]["rooms"]["Row"] | null
  ) => {
    id.value = data?.id;
    room_name.value = data?.room_name;
    x.value = data?.x ?? null;
    o.value = data?.o ?? null;
    result.value = data?.result ?? null;
    board.value = data?.board ?? BOARD;
    turn.value = data?.turn ?? Mark.X;
  };

  return {
    /* state */
    id,
    room_name,
    x,
    o,
    turn,
    board,
    result,

    players,

    /* getters */
    player,
    opponent,
    winningLine,

    /* actions */
    $reset,
    setDataFromResponse,
  };
});
