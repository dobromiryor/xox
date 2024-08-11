<script lang="ts" setup>
import { useRoomStore } from "~/stores/room.store";
import O from "../atoms/O.vue";
import X from "../atoms/X.vue";

defineProps<{
  rowIndex: number;
  squareIndex: number;
}>();

const roomStore = useRoomStore();
</script>

<template>
  <div
    class="relative flex justify-center items-center min-w-16 w-full max-w-40"
  >
    <div
      class="absolute flex justify-center items-center p-[1px] bg-gradient-to-b from-zinc-600 via-bg to-zinc-900 min-w-16 w-full max-w-40 aspect-square rounded-lg transition-all"
      :class="{
        '-top-1 hover:-top-1':
          !!roomStore.board?.[rowIndex][squareIndex] ||
          !(roomStore.player?.mark === roomStore.turn) ||
          !!roomStore.result ||
          !!!roomStore.opponent,
        '-top-2 hover:-top-1.5':
          !!!roomStore.board?.[rowIndex][squareIndex] &&
          roomStore.player?.mark === roomStore.turn &&
          !!!roomStore.result &&
          !!roomStore.opponent,
      }"
    >
      <button
        :aria-label="`Row ${rowIndex + 1}, square ${squareIndex + 1}`"
        class="flex justify-center items-center w-full aspect-square rounded-lg bg-bg"
        :disabled="
          !!roomStore.board?.[rowIndex][squareIndex] ||
          !(roomStore.player?.mark === roomStore.turn) ||
          !!roomStore.result ||
          !!!roomStore.opponent ||
          roomStore.isLoading
        "
        @click="$emit('handleClick')"
      >
        <X :rowIndex="rowIndex" :squareIndex="squareIndex" />
        <O :rowIndex="rowIndex" :squareIndex="squareIndex" />
      </button>
    </div>
    <div
      class="min-w-16 w-full max-w-40 aspect-square rounded-lg bg-zinc-900 border border-black box-content shadow-md"
    ></div>
  </div>
</template>
