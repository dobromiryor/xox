<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Button from "~/components/atoms/Button.vue";
import Display from "~/components/atoms/Display.vue";
import { useNameStore } from "../../stores/name.store";

const { index } = defineProps<{
  index: 0 | 1 | 2;
}>();
const letters = useNameStore();

const route = useRoute();
const router = useRouter();

const resetError = () => route.query.error && router.replace({ query: null! });

const handleDecrement = () => {
  resetError();

  if (letters[index] > 0) {
    letters[index]--;
  } else {
    letters[index] = letters.dictionary.length - 1;
  }
};
const handleIncrement = () => {
  resetError();

  if (letters[index] < letters.dictionary.length - 1) {
    letters[index]++;
  } else {
    letters[index] = 0;
  }
};

const getOrdinalNumber = (index: number) => {
  switch (index) {
    case 0:
      return "first";
    case 1:
      return "second";
    case 2:
      return "third";
  }
};
</script>

<template>
  <div
    tabindex="0"
    :aria-label="`${getOrdinalNumber(index)} letter`"
    class="flex flex-col gap-2"
  >
    <Button :aria-label="`previous character`" @click="handleDecrement">
      ▲
    </Button>

    <Display class="text-5xl min-[350px]:text-7xl min-[480px]:text-9xl w-">
      <p
        tabindex="0"
        aria-live="polite"
        class="min-w-9 min-h-12 min-[350px]:min-w-14 min-[350px]:min-h-[72px] min-[480px]:min-w-[100px] min-[480px]:min-h-32 text-center"
      >
        {{ letters.dictionary[letters[index]] }}
      </p>
    </Display>

    <Button aria-label="next character" @click="handleIncrement">▼</Button>
  </div>
</template>
