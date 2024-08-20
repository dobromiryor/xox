<script setup lang="ts">
import { useRoute } from "vue-router";
import Button from "~/components/atoms/Button.vue";
import Emoji from "~/components/atoms/Emoji.vue";
import { EMOJI } from "~/consts/emoji.const";
import { useNameStore } from "~/stores/name.store";
import { useRoomStore } from "~/stores/room.store";
import { supabase } from "~/supabase/supabaseClient";

const { params } = useRoute();

const roomStore = useRoomStore();
const nameStore = useNameStore();

const room = supabase.channel(params.room_name as string, {
	config: {
		broadcast: { self: true },
		presence: { key: params.room_name as string },
	},
});

const sendEmoji = async (emojiKey: keyof typeof EMOJI) => {
	await room.send({
		type: "broadcast",
		event: "emoji",
		payload: {
			emojiKey,
			from: nameStore.name,
		},
	});
};
</script>

<template>
	<div class="grid grid-flow-col grid-rows-2 grid-cols-4 gap-2">
		<Button
			v-for="emoji in Object.keys(EMOJI)"
			@click="sendEmoji(emoji as keyof typeof EMOJI)"
			:key="`Emoji__Button__${emoji}`"
			:style="'bg'"
			:disabled="!!!roomStore.opponent"
		>
			<Emoji
				class="transition-all duration-300"
				:class="{
					grayscale: !!!roomStore.opponent,
					'grayscale-0': !!roomStore.opponent,
				}"
				:emoji="(emoji as keyof typeof EMOJI)"
			/>
		</Button>
	</div>
</template>
