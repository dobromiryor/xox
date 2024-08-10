<script setup lang="ts">
import Display from "~/components/atoms/Display.vue";
import { useRoomStore } from "~/stores/room.store";
const roomStore = useRoomStore();
</script>

<template>
  <Display>
    <p
      :role="!!roomStore.result && 'alert'"
      aria-live="assertive"
      v-if="roomStore.result && roomStore.result === 'TIE'"
    >
      DRAW!
    </p>
    <p
      :role="!!roomStore.result && 'alert'"
      aria-live="assertive"
      v-else-if="roomStore.result"
    >
      <span class="-translate-y-[3px] text-[32px] leading-[calc(2/3)]">{{
        roomStore.result.toLocaleLowerCase()
      }}</span>
      <span> WON!</span>
    </p>
  </Display>
</template>
