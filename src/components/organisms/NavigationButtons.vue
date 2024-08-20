<script setup lang="ts">
import { useRoute } from "vue-router";
import Button from "~/components/atoms/Button.vue";
import LinkButton from "~/components/atoms/LinkButton.vue";
import { Mark } from "~/enums/mark.enum";
import { useNameStore } from "~/stores/name.store";
import { useRoomStore } from "~/stores/room.store";
import { insertRoom } from "~/supabase/api/room.api";
import { supabase } from "~/supabase/supabaseClient";

const roomStore = useRoomStore();
const nameStore = useNameStore();
const { params } = useRoute();

const room = supabase.channel(params.room_name as string, {
	config: {
		broadcast: { self: true },
		presence: { key: params.room_name as string },
	},
});

const createNewGameAs = async (mark: Mark) => {
	if (roomStore.x && roomStore.o) {
		const payload =
			mark === Mark.X
				? { x: roomStore.x, o: roomStore.o }
				: { x: roomStore.o, o: roomStore.x };

		const { data } = await insertRoom(payload);

		if (data) {
			await room.send({
				type: "broadcast",
				event: "new_game",
				payload: {
					room_name: data.room_name,
				},
			});
		}
	}
};
</script>

<template>
	<div class="flex flex-col gap-2">
		<LinkButton :disabled="!!!roomStore.result" to="/"> Home </LinkButton>
		<Button
			v-if="roomStore.x === nameStore.name"
			:disabled="!!!roomStore.result"
			@click="createNewGameAs(Mark.X)"
			>New game as X</Button
		>
		<Button
			v-if="roomStore.x === nameStore.name"
			:disabled="!!!roomStore.result"
			@click="createNewGameAs(Mark.O)"
			>New game as O</Button
		>
	</div>
</template>
