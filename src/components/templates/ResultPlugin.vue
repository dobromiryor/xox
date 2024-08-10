<script setup lang="ts">
import ResultDisplay from "~/components/molecules/ResultDisplay.vue";
import NavigationButtons from "~/components/organisms/NavigationButtons.vue";
import { useRoomStore } from "~/stores/room.store";

const roomStore = useRoomStore();
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="translate-y-2/3 scale-75 opacity-0"
    leave-active-class="transition-all duration-300"
    leave-to-class="translate-y-2/3 scale-75 opacity-0"
    mode="out-in"
  >
    <div
      v-if="roomStore.result"
      :class="{
        'before:absolute before:-top-[2px] before:-left-[2px] before:flex before:flex-col before:w-[calc(100%_+_4px)] before:h-[calc(100%_+_4px)] before:rounded-xl before:shadow-2xl before:bg-gradient-to-b before:from-gray-300 before:via-bg-secondary before:to-gray-700 before:from-[-100%] before:to-[200%] before:-z-[1]': true,
        /*  */
        'relative flex flex-col gap-3 w-[calc(100%_-_4px)] max-w-lg my-[3px] p-4 bg-bg-secondary rounded-xl z-auto': true,
        /*  */
        'after:absolute after:-top-4 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-4 after:bg-gradient-to-r after:from-neutral-500 after:via-neutral-300 after:to-neutral-500 after:from-[-50%] after:to-[150%] after:rounded-t-sm after:border-t-1 after:border-t-neutral-200 after:-z-50': true,
      }"
    >
      <ResultDisplay />
      <NavigationButtons />
    </div>
  </Transition>
</template>
