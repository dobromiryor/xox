<script setup lang="ts">
import Display from "~/components/atoms/Display.vue";
import Emoji from "~/components/atoms/Emoji.vue";
import { EMOJI } from "~/consts/emoji.const";
import { Mark } from "~/enums/mark.enum";
import { useEmojiStore } from "~/stores/emoji.store";
const { mark } = defineProps<{ mark: Mark | undefined }>();
const emojiStore = useEmojiStore();
</script>

<template>
  <Display class="min-w-[72px] w-full justify-center items-center">
    <Emoji
      v-if="!!mark"
      :role="(emojiStore[mark === Mark.X ? 'lastXEmoji' : 'lastOEmoji'] as keyof typeof EMOJI)&&'alert'"
      aria-live="polite"
      :emoji="(emojiStore[mark === Mark.X ? 'lastXEmoji' : 'lastOEmoji'] as keyof typeof EMOJI)"
      :mark="mark"
    />
  </Display>
</template>
