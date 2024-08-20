import { defineStore } from "pinia";
import { ref } from "vue";
import { EMOJI } from "~/consts/emoji.const";
import { useRoomStore } from "~/stores/room.store";

export const useEmojiStore = defineStore("emoji", () => {
	const roomStore = useRoomStore();

	const lastXEmoji = ref<keyof typeof EMOJI | undefined>();
	const lastOEmoji = ref<keyof typeof EMOJI | undefined>();

	const setLastEmoji = (emoji: keyof typeof EMOJI, from: string) => {
		(from === roomStore.x ? lastXEmoji : lastOEmoji).value =
			emoji === "clear" ? undefined : emoji;
	};

	const clearEmojis = () => {
		lastXEmoji.value = undefined;
		lastOEmoji.value = undefined;
	};

	return { lastOEmoji, lastXEmoji, setLastEmoji, clearEmojis };
});
