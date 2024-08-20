<script setup lang="ts">
import { EMOJI } from "~/consts/emoji.const";
import { type Mark } from "~/enums/mark.enum";
import { useRoomStore } from "~/stores/room.store";

const { emoji, mark } = defineProps<{
	emoji: keyof typeof EMOJI | undefined;
	mark?: Mark;
}>();

const roomStore = useRoomStore();

if (mark) {
	if (emoji && emoji !== "clear") {
		/* mark.emoji.alt */
	} else {
		/* '' */
	}
} else {
	if (emoji && emoji !== "clear") {
		/* emoji.alt */
	} else {
		/* clear.alt */
	}
}
</script>

<template>
	<p
		:aria-label="
			!!mark
				? !!emoji && emoji !== 'clear'
					? `${EMOJI[emoji]?.alt} from ${
						roomStore[mark?.toLowerCase() as keyof typeof roomStore]
						}`
					: ''
				: !!emoji && emoji !== 'clear'
					? EMOJI[emoji]?.alt
					: EMOJI.clear.alt
		"
		class="flex font-emoji text-xs min-[320px]:text-sm sm:text-base">
		<span
			aria-hidden="true"
			v-for="(emoji, index) in EMOJI[emoji!]?.emoji ?? []"
			:key="`Emoji__Span__${emoji}__${index}__${Date.now()}`">
			{{ emoji }}
		</span>
	</p>
</template>
