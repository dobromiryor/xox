import { useRoomStore } from "~/stores/room.store";
import {
	type InsertRoom,
	type RoomRow,
	type UpdateRoom,
} from "~/types/room.types";
import {
	deleteRoom,
	findRoomByName,
	getAllRooms,
	insertRoom,
	updateRoomByName,
} from "./room.api";

import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { supabase } from "~/supabase/supabaseClient";

vi.mock("~/supabase/supabaseClient", () => ({
	supabase: {
		from: vi.fn().mockReturnValue({
			select: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					maybeSingle: vi.fn(),
				}),
			}),
			insert: vi.fn().mockReturnValue({
				select: vi.fn().mockReturnValue({
					limit: vi.fn().mockReturnValue({
						single: vi.fn().mockResolvedValue({ data: { id: 1 } }),
					}),
				}),
			}),
			update: vi.fn().mockReturnValue({
				eq: vi.fn().mockReturnValue({
					select: vi.fn().mockReturnValue({
						single: vi.fn(),
					}),
				}),
			}),
			delete: vi.fn().mockReturnValue({
				eq: vi.fn(),
			}),
		}),
	},
}));

describe("insertRoom", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("returns data when syncData is true and payload is provided", async () => {
		const payload: InsertRoom = {};
		const result = await insertRoom(payload);
		expect(result.data).toEqual({ id: 1 });
	});

	it("returns data when syncData is true and payload is not provided", async () => {
		const result = await insertRoom();
		expect(result.data).toEqual({ id: 1 });
	});

	it("returns data when syncData is false and payload is provided", async () => {
		const payload: InsertRoom = {};
		const result = await insertRoom(payload, { syncData: false });
		expect(result.data).toEqual({ id: 1 });
	});

	it("returns data when syncData is false and payload is not provided", async () => {
		const result = await insertRoom(undefined, { syncData: false });
		expect(result.data).toEqual({ id: 1 });
	});

	it("sets roomStore.isLoading to true before inserting data", async () => {
		const roomStore = useRoomStore();
		insertRoom().finally(() => expect(roomStore.isLoading).toBe(false));
		expect(roomStore.isLoading).toBe(true);
	});

	it("calls roomStore.setDataFromResponse when syncData is true and data is returned", async () => {
		const roomStore = useRoomStore();
		const setDataFromResponseSpy = vi.spyOn(roomStore, "setDataFromResponse");
		await insertRoom();
		expect(setDataFromResponseSpy).toHaveBeenCalledTimes(1);
	});

	it("throws an error when the database operation fails", async () => {
		const error = new Error("Database operation failed");

		vi.mocked(
			supabase
				.from("rooms")
				.insert({ room_name: "test-room-name" })
				.select()
				.limit(1).single
		).mockRejectedValueOnce(error);

		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(insertRoom()).rejects.toThrow(error);

		spy.mockRestore();
	});
});

describe("getAllRooms", () => {
	vi.mocked(supabase.from("rooms").select).mockResolvedValueOnce({
		data: [],
		error: null,
		count: 2,
		status: 200,
		statusText: "OK",
	});

	it("returns an empty array when there are no rooms", async () => {
		const result = await getAllRooms();
		expect(result).toEqual({ data: [] });
	});

	it("returns an array of rooms when there are rooms in the database", async () => {
		const roomData: RoomRow[] = [
			{
				id: 1,
				room_name: "test-room-name",
				board: [[], [], []],
				created_at: "",
				o: null,
				result: null,
				turn: "X",
				x: "TST",
			},
			{
				id: 2,
				room_name: "test-room-two",
				board: [[], [], []],
				created_at: "",
				o: "TS2",
				result: "X",
				turn: "X",
				x: "TST",
			},
		];

		vi.mocked(supabase.from("rooms").select).mockResolvedValueOnce({
			data: roomData,
			error: null,
			count: 2,
			status: 200,
			statusText: "OK",
		});

		const result = await getAllRooms();
		expect(result).toEqual({ data: roomData });
	});

	it("sets roomStore.isLoading to true before inserting data", async () => {
		const roomStore = useRoomStore();
		getAllRooms().finally(() => expect(roomStore.isLoading).toBe(false));
		expect(roomStore.isLoading).toBe(true);
	});

	it("throws an error when the database operation fails", async () => {
		const error = new Error("Database operation failed");
		vi.mocked(supabase.from("rooms").select).mockRejectedValueOnce(error);

		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(getAllRooms()).rejects.toThrow(error);

		spy.mockRestore();
	});
});

describe("findRoomByName", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	const roomData: RoomRow = {
		id: 1,
		room_name: "test-room-name",
		board: [[], [], []],
		created_at: "",
		o: null,
		result: null,
		turn: "X",
		x: "TST",
	};

	it("returns the room data if the room exists", async () => {
		vi.mocked(
			supabase.from("rooms").select().eq("room_name", "test-room-name")
				.maybeSingle
		).mockResolvedValueOnce({
			data: roomData,
			error: null,
			count: 1,
			status: 200,
			statusText: "OK",
		});

		const result = await findRoomByName("test-room-name");

		expect(result).toEqual({ data: roomData });
	});

	it("returns null if the room does not exist", async () => {
		vi.mocked(
			supabase.from("rooms").select().eq("room_name", "test-room-name")
				.maybeSingle
		).mockResolvedValueOnce({
			data: null!,
			error: null,
			count: 1,
			status: 200,
			statusText: "OK",
		});

		const result = await findRoomByName("non-existent-room");
		expect(result).toEqual({ data: null });
	});

	it("sets roomStore.isLoading to true before inserting data", async () => {
		vi.mocked(
			supabase.from("rooms").select().eq("room_name", "test-room-name")
				.maybeSingle
		).mockResolvedValueOnce({
			data: roomData,
			error: null,
			count: 1,
			status: 200,
			statusText: "OK",
		});

		const roomStore = useRoomStore();

		findRoomByName("test-room-name").finally(() => {
			expect(roomStore.isLoading).toBe(false);
		});

		expect(roomStore.isLoading).toBe(true);
	});

	it("calls roomStore.setDataFromResponse when syncData is true and data is returned", async () => {
		vi.mocked(
			supabase.from("rooms").select().eq("room_name", "test-room-name")
				.maybeSingle
		).mockResolvedValueOnce({
			data: roomData,
			error: null,
			count: 1,
			status: 200,
			statusText: "OK",
		});

		const roomStore = useRoomStore();
		const setDataFromResponseSpy = vi.spyOn(roomStore, "setDataFromResponse");
		await findRoomByName("test-room-name");
		expect(setDataFromResponseSpy).toHaveBeenCalledTimes(1);
	});

	it("throws an error when the database operation fails", async () => {
		const error = new Error("Database operation failed");
		vi.mocked(
			supabase.from("rooms").select().eq("room_name", "test-room-name")
				.maybeSingle
		).mockRejectedValueOnce(error);

		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(findRoomByName("test-room-name")).rejects.toThrow(error);

		spy.mockRestore();
	});
});

describe("updateRoomByName", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	const roomData: RoomRow = {
		id: 1,
		room_name: "test-room-name",
		board: [[], [], []],
		created_at: "",
		o: null,
		result: null,
		turn: "X",
		x: "TST",
	};

	const updatedRoomData: UpdateRoom = {
		board: [[], [], []],
	};

	it("updates the room data when the room exists", async () => {
		vi.mocked(
			supabase
				.from("rooms")
				.update(updatedRoomData)
				.eq("room_name", "test-room-name")
				.select().single
		).mockResolvedValue({
			data: roomData,
			error: null,
			count: 1,
			status: 200,
			statusText: "OK",
		});

		const result = await updateRoomByName("test-room-name", updatedRoomData);

		expect(result).toEqual({ data: roomData });
	});

	it("returns null when the room does not exist", async () => {
		vi.mocked(
			supabase
				.from("rooms")
				.update(updatedRoomData)
				.eq("room_name", "test-room-name")
				.select().single
		).mockResolvedValueOnce({
			data: null!,
			error: null,
			count: 1,
			status: 200,
			statusText: "OK",
		});

		const result = await updateRoomByName("non-existent-room", updatedRoomData);

		expect(result).toEqual({ data: null });
	});

	it("calls roomStore.setDataFromResponse when syncData is true and data is returned", async () => {
		vi.mocked(
			supabase
				.from("rooms")
				.update(updatedRoomData)
				.eq("room_name", "test-room-name")
				.select().single
		).mockResolvedValueOnce({
			data: roomData,
			error: null,
			count: 1,
			status: 200,
			statusText: "OK",
		});

		const roomStore = useRoomStore();
		const setDataFromResponseSpy = vi.spyOn(roomStore, "setDataFromResponse");
		await updateRoomByName("test-room-name", updatedRoomData, {
			syncData: true,
		});
		expect(setDataFromResponseSpy).toHaveBeenCalledTimes(1);
	});

	it("throws an error when the database operation fails", async () => {
		const error = new Error("Database operation failed");
		vi.mocked(
			supabase
				.from("rooms")
				.update(updatedRoomData)
				.eq("room_name", "test-room-name")
				.select().single
		).mockRejectedValueOnce(error);

		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(
			updateRoomByName("test-room-name", updatedRoomData)
		).rejects.toThrow(error);

		spy.mockRestore();
	});
});

describe("deleteRoom", () => {
	vi.mocked(supabase.from("rooms").delete().eq).mockResolvedValueOnce({
		data: undefined!,
		error: null,
		count: undefined!,
		status: 204,
		statusText: "OK",
	});

	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("deletes the room when the room exists", async () => {
		const error = new Error("Database operation failed");
		expect(deleteRoom("test-room-name")).not.toThrow(error);
	});

	it("calls roomStore.$reset when syncData is true", async () => {
		const roomStore = useRoomStore();
		const resetSpy = vi.spyOn(roomStore, "$reset");

		await deleteRoom("test-room-name", { syncData: true });

		expect(resetSpy).toHaveBeenCalledTimes(1);
	});

	it("does not call roomStore.$reset when syncData is false", async () => {
		const roomStore = useRoomStore();
		const resetSpy = vi.spyOn(roomStore, "$reset");

		await deleteRoom("test-room-name", { syncData: false });

		expect(resetSpy).not.toHaveBeenCalled();
	});

	it("throws an error when the database operation fails", async () => {
		const error = new Error("Database operation failed");
		vi.mocked(supabase.from("rooms").delete().eq).mockRejectedValueOnce(error);

		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(deleteRoom("test-room-name")).rejects.toThrow(error);

		spy.mockRestore();
	});
});
