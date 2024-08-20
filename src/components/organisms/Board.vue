<script setup lang="ts">
import { Mark } from "~/enums/mark.enum";
import { useRoomStore } from "~/stores/room.store";
import { updateRoomByName } from "~/supabase/api/room.api";
import { getResult } from "~/utils/getResult";
import Square from "../molecules/Square.vue";

const roomStore = useRoomStore();

const handleClick = async (rowIndex: number, squareIndex: number) => {
	let newBoard = roomStore.board!;
	newBoard[rowIndex][squareIndex] = roomStore.turn;

	const result = getResult(roomStore.turn, newBoard);

	await updateRoomByName(roomStore.room_name!, {
		...(result ? { result } : {}),
		board: newBoard,
		turn: roomStore.turn === Mark.X ? Mark.O : Mark.X,
	});
};
</script>

<template>
	<div class="flex flex-col justify-center items-center gap-2 w-full">
		<div
			class="flex justify-center items-center gap-2 w-full"
			v-for="(row, rowIndex) in roomStore.board"
			:key="`Board__Row__${rowIndex}`"
		>
			<Square
				v-for="(_, squareIndex) in row"
				:rowIndex="rowIndex"
				:squareIndex="squareIndex"
				:key="`Board__Row__${rowIndex}__Square__${squareIndex}`"
				@click="async () => await handleClick(rowIndex, squareIndex)"
			/>
		</div>
	</div>
</template>
