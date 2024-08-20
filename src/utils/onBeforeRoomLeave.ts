import { RouteLocationNormalizedGeneric } from "vue-router";
import { Result } from "~/enums/result.enum";
import { useRoomStore } from "~/stores/room.store";
import { deleteRoom, updateRoomByName } from "~/supabase/api/room.api";

export const onBeforeRoomLeave = async (
	leaveGuard: Partial<RouteLocationNormalizedGeneric>,
	name: string | null,
	roomStore: ReturnType<typeof useRoomStore>
) => {
	if (!roomStore.room_name) return;
	/* kicked for duplicate name */
	if (!!leaveGuard.query?.error) return true;
	/* game over */
	if (roomStore.result) return true;

	if (!!roomStore.x && !!roomStore.o) {
		const answer = window.confirm(
			"Leaving will result in a loss. Are you sure you want to leave?"
		);

		if (answer) {
			const winner = roomStore.players.find((player) => player.name !== name);
			const result =
				roomStore.x === winner?.name
					? Result.X
					: roomStore.o === winner?.name
					? Result.O
					: null;

			await updateRoomByName(roomStore.room_name, { result });

			return true;
		} else {
			return false;
		}
	} else {
		const answer = window.confirm("Are you sure you want to leave?");

		if (roomStore.x === name) {
			if (answer) {
				await deleteRoom(roomStore.room_name);

				return true;
			} else {
				return false;
			}
		} else {
			if (answer) {
				return true;
			} else {
				return false;
			}
		}
	}
};
