<script lang="ts" setup>
import { onMounted, watch } from "vue";
import { useNameStore } from "../../stores/name.store";
import Letter from "../atoms/Letter.vue";

const letters = useNameStore();

watch(letters, () => {
  const key = "xox";
  if (letters.name && letters.name.length > 0) {
    localStorage.setItem(key, letters.name);
  } else {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  }
});

onMounted(() => {
  letters.setPersistedName();
});
</script>

<template>
  <section class="flex justify-center items-center">
    <div class="flex justify-around gap-2 w-full">
      <Letter :index="0" />
      <Letter :index="1" />
      <Letter :index="2" />
    </div>
  </section>
</template>
