<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="-translate-y-2/3 scale-75 opacity-0 blur brightness-50"
      leave-active-class="transition-all duration-300"
      leave-to-class="translate-y-2/3 scale-75 opacity-0 blur brightness-50"
      mode="out-in"
    >
      <component :is="Component" :key="$route.path" />
    </Transition>
  </RouterView>
</template>
