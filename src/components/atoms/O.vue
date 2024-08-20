<script lang="ts" setup>
import o from "~/assets/o.svg";
import { Mark } from "~/enums/mark.enum";
import { useRoomStore } from "~/stores/room.store";

defineProps<{
	rowIndex: number;
	squareIndex: number;
}>();

const roomStore = useRoomStore();
</script>

<template>
	<div
		class="absolute top-0 left-0 justify-center items-center w-full h-full p-4 transition-allow-discrete transition-all duration-300"
		:role="
			!!roomStore.opponent &&
			roomStore.board?.[rowIndex][squareIndex] === Mark.O
				? 'alert'
				: ''
		"
		aria-live="polite"
		:aria-label="`O mark at row ${rowIndex + 1}, square ${squareIndex + 1}`"
		:tabindex="
			!!roomStore.opponent &&
			roomStore.board?.[rowIndex][squareIndex] === Mark.O
				? 0
				: -1
		"
		:class="{
			'flex starting:opacity-0 opacity-100':
				roomStore.board?.[rowIndex][squareIndex] === Mark.O,
			'hidden starting:opacity-100 opacity-0':
				roomStore.board?.[rowIndex][squareIndex] !== Mark.O,
			/* exists in winning line */
			/* parent */
			'opacity-100 grayscale-0':
				!!roomStore.result &&
				roomStore.winningLine.O?.[rowIndex][squareIndex] ===
					roomStore.board?.[rowIndex][squareIndex],
			'opacity-75 grayscale-[75%]':
				!!roomStore.result &&
				roomStore.winningLine.O?.[rowIndex][squareIndex] !==
					roomStore.board?.[rowIndex][squareIndex],
			/* child */
			'*:drop-shadow-mark-glow-o-intense':
				!!roomStore.result &&
				roomStore.winningLine.O?.[rowIndex][squareIndex] ===
					roomStore.board?.[rowIndex][squareIndex],
			'*:drop-shadow-mark-glow-o':
				!!roomStore.result &&
				roomStore.winningLine.O?.[rowIndex][squareIndex] !==
					roomStore.board?.[rowIndex][squareIndex],
		}"
	>
		<img aria-hidden="true" :src="o" class="transition-all duration-300" />
	</div>
</template>
