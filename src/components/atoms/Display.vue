<script setup lang="ts">
import Loader from "~/components/atoms/Loader.vue";

defineProps<{ loader?: boolean; loaderLabel?: string }>();
</script>

<template>
  <div
    class="flex justify-center items-center gap-2 py-2 px-4 bg-zinc-900 text-white font-pixel text-2xl leading-[1] rounded-md select-none border-t-gray-700 border-b border-b-gray-400"
  >
    <slot>
      <Loader v-if="loader" :aria-label="loaderLabel" />
      <div v-else class="w-6 h-6"></div>
    </slot>
  </div>
</template>
