import { generateSlug } from "random-word-slugs";
import { BOARD } from "~/consts/board.const";
import { useNameStore } from "~/stores/name.store";
import { useRoomStore } from "~/stores/room.store";
import { supabase } from "~/supabase/supabaseClient";
import { InsertRoom, RoomRow, UpdateRoom } from "~/types/room.types";

interface Options {
	syncData?: boolean;
}

/**
 * Inserts a new room into the database.
 *
 * @param {InsertRoom} [payload] - Optional data to insert into the room.
 * @param {Options} [options] - Options for the insert operation.
 * @param {boolean} [options.syncData=true] - Whether to sync the room data after insertion.
 * @return {Promise<{ data: RoomRow | null }>} The inserted room data, or null if the operation failed.
 */
export const insertRoom = async (
	payload?: InsertRoom,
	{ syncData }: Options = { syncData: true }
): Promise<{ data: RoomRow | null }> => {
	try {
		const nameStore = useNameStore();
		const roomStore = useRoomStore();

		roomStore.isLoading = true;

		const board = BOARD;

		const insertionData = payload ?? { x: nameStore.name };

		const { data } = await supabase
			.from("rooms")
			.insert({
				room_name: generateSlug(),
				board,
				...insertionData,
			})
			.select()
			.limit(1)
			.single();

		if (data && syncData) {
			roomStore.setDataFromResponse(data);
		}

		return { data };
	} catch (error) {
		console.error("Failed to insert room", error);

		throw error;
	}
};

/**
 * Retrieves all rooms from the database.
 *
 * @return {Promise<{ data: RoomRow[] | null }>} An object containing an array of room data, or null if the operation failed.
 */
export const getAllRooms = async (): Promise<{ data: RoomRow[] | null }> => {
	try {
		const roomStore = useRoomStore();
		roomStore.isLoading = true;

		const { data } = await supabase.from("rooms").select();

		roomStore.isLoading = false;

		return { data };
	} catch (error) {
		console.error("Failed to get rooms", error);

		throw error;
	}
};

/**
 * Finds a room by its name in the database.
 *
 * @param {string} room_name - The name of the room to find.
 * @param {Options} [options] - Options for the find operation.
 * @param {boolean} [options.syncData=true] - Whether to sync the room data after finding.
 * @return {Promise<{ data: RoomRow | null }>} - A promise that resolves to an object containing the found room data, or null if the operation failed.
 */
export const findRoomByName = async (
	room_name: string,
	{ syncData }: Options = { syncData: true }
): Promise<{ data: RoomRow | null }> => {
	try {
		const roomStore = useRoomStore();

		roomStore.isLoading = true;

		const { data } = await supabase
			.from("rooms")
			.select()
			.eq("room_name", room_name)
			.maybeSingle();

		if (data && syncData) {
			roomStore.setDataFromResponse(data);
		}

		return { data };
	} catch (error) {
		console.error("Failed to find room", error);

		throw error;
	}
};

/**
 * Updates a room in the database by its name.
 *
 * @param {string} room_name - The name of the room to update.
 * @param {UpdateRoom} payload - The data to update the room with.
 * @param {Options} [options] - Options for the update operation.
 * @param {boolean} [options.syncData=true] - Whether to sync the room data after updating.
 * @return {Promise<{ data: RoomRow | null }>} - A promise that resolves to an object containing the updated room data, or null if the operation failed.
 */
export const updateRoomByName = async (
	room_name: string,
	payload: UpdateRoom,
	{ syncData }: Options = { syncData: true }
): Promise<{ data: RoomRow | null }> => {
	try {
		const roomStore = useRoomStore();

		roomStore.isLoading = true;

		const { data } = await supabase
			.from("rooms")
			.update(payload)
			.eq("room_name", room_name)
			.select()
			.single();

		if (data && syncData) {
			roomStore.setDataFromResponse(data);
		}

		return { data };
	} catch (error) {
		console.error("Failed to update room", error);

		throw error;
	}
};

/**
 * Deletes a room from the database.
 *
 * @param {string} room_name - The name of the room to delete.
 * @param {Options} [options] - Options for the delete operation.
 * @param {boolean} [options.syncData=true] - Whether to sync the room data after deleting.
 * @return {Promise<void>} - A promise that resolves when the room is deleted.
 */
export const deleteRoom = async (
	room_name: string,
	{ syncData }: Options = { syncData: true }
): Promise<void> => {
	try {
		const roomStore = useRoomStore();

		roomStore.isLoading = true;

		await supabase.from("rooms").delete().eq("room_name", room_name);

		if (syncData) {
			roomStore.$reset();
		}
	} catch (error) {
		console.error("Failed to delete room", error);

		throw error;
	}
};
