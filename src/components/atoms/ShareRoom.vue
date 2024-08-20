<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { useNameStore } from "~/stores/name.store";
import { useRoomStore } from "~/stores/room.store";

const roomStore = useRoomStore();
const nameStore = useNameStore();

const toggle = ref(false);
const copied = ref(false);
const copiedTimeout = ref<ReturnType<typeof setTimeout>>();

const handleCopy = async () => {
	try {
		if (copiedTimeout.value) {
			clearTimeout(copiedTimeout.value);
		}

		await navigator.clipboard.writeText(roomStore.room_name!);

		copied.value = true;

		copiedTimeout.value = setTimeout(() => {
			copied.value = false;
		}, 3000);
	} catch (err) {
		console.error("Copy to clipboard unsuccessful", err);
	}
};

const handleShare = async () => {
	/* global ShareData */
	const data: ShareData = {
		url: `${roomStore.room_name}`,
		text: `Join ${nameStore.name} in xox!`,
		title: "xox",
	};

	try {
		await navigator.share(data);
	} catch (err) {
		console.error("Share unsuccessful", err);

		await handleCopy();
	}

	toggle.value = !toggle.value;
};

onUnmounted(() => clearTimeout(copiedTimeout.value));
</script>

<template>
	<div
		class="fixed bottom-4 right-4 flex flex-col gap-1 justify-center items-center text-zinc-900 z-50">
		<p
			v-if="copied"
			aria-live="polite"
			class="p-1 bg-bg-secondary text-white rounded text-xs opacity-0 select-none pointer-events-none animate-copied">
			Copied to clipboard!
		</p>
		<button
			aria-label="Share room name"
			class="relative group hover:bg-bg-secondary px-2 py-0.5 rounded transition-all"
			@click="handleShare">
			<span
				aria-hidden="true"
				class="absolute top-1/2 -left-1 -translate-y-1/2 transition-all transition-allow-discrete -z-10 select-none text-xs"
				:class="{
					/* hidden */
					'hidden starting:-translate-x-full -translate-x-0 starting:opacity-100 opacity-0': true,
					/* hovered */
					'group-hover:inline-block group-hover:starting:-translate-x-0 group-hover:-translate-x-full group-hover:starting:opacity-0 group-hover:opacity-100': true,
				}"
				>🔗</span
			>
			{{ roomStore.room_name }}
		</button>
	</div>
</template>
