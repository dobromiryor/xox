import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, test, vitest } from "vitest";
import { ErrorMessage } from "~/enums/error.enum";
import { useRoomStore } from "~/stores/room.store";
import { RoomRow } from "~/types/room.types";
import { onBeforeRoomLeave } from "~/utils/onBeforeRoomLeave";

const initialRoomStoreState: RoomRow = {
	board: [],
	created_at: "",
	id: 1,
	o: null,
	result: null,
	room_name: "test-room-name",
	turn: "X",
	x: "TST",
};

describe("room leave guard", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	test("missing room name", async () => {
		const roomStore = useRoomStore();

		roomStore.setDataFromResponse({
			...initialRoomStoreState,
			room_name: undefined!,
		});

		expect(await onBeforeRoomLeave({}, "TST", roomStore)).toBe(undefined);
	});

	test("duplicate name", async () => {
		const roomStore = useRoomStore();

		roomStore.setDataFromResponse({ ...initialRoomStoreState });

		expect(
			await onBeforeRoomLeave(
				{ query: { error: ErrorMessage.ROOM_FULL } },
				"TST",
				roomStore
			)
		).toBe(true);
	});

	test("game is over", async () => {
		const roomStore = useRoomStore();

		roomStore.setDataFromResponse({ ...initialRoomStoreState, result: "TIE" });

		expect(
			await onBeforeRoomLeave(
				{ query: { error: ErrorMessage.ROOM_FULL } },
				"TST",
				roomStore
			)
		).toBe(true);
	});

	describe("leave confirmation with two players", () => {
		test("confirm", async () => {
			const roomStore = useRoomStore();

			roomStore.setDataFromResponse({ ...initialRoomStoreState, o: "T2" });

			global.confirm = vitest.fn(() => true);

			expect(
				await onBeforeRoomLeave(
					{ query: { error: ErrorMessage.ROOM_FULL } },
					"TST",
					roomStore
				)
			).toBe(true);
		});

		test("cancel", async () => {
			const roomStore = useRoomStore();

			roomStore.setDataFromResponse({ ...initialRoomStoreState, o: "T2" });

			global.confirm = vitest.fn(() => false);

			expect(
				await onBeforeRoomLeave(
					{ query: { error: ErrorMessage.ROOM_FULL } },
					"TST",
					roomStore
				)
			).toBe(true);
		});
	});

	describe("leave confirmation with one player", () => {
		describe("for player x", () => {
			test("confirm", async () => {
				const roomStore = useRoomStore();

				roomStore.setDataFromResponse({ ...initialRoomStoreState });

				global.confirm = vitest.fn(() => true);

				expect(
					await onBeforeRoomLeave(
						{ query: { error: ErrorMessage.ROOM_FULL } },
						"TST",
						roomStore
					)
				).toBe(true);
			});
			test("cancel", async () => {
				const roomStore = useRoomStore();

				roomStore.setDataFromResponse({ ...initialRoomStoreState });

				global.confirm = vitest.fn(() => false);

				expect(
					await onBeforeRoomLeave(
						{ query: { error: ErrorMessage.ROOM_FULL } },
						"TST",
						roomStore
					)
				).toBe(true);
			});
		});

		describe("for player O", () => {
			test("confirm", async () => {
				const roomStore = useRoomStore();

				roomStore.setDataFromResponse({
					...initialRoomStoreState,
					x: null,
					o: "T2",
				});

				global.confirm = vitest.fn(() => true);

				expect(
					await onBeforeRoomLeave(
						{ query: { error: ErrorMessage.ROOM_FULL } },
						"TST",
						roomStore
					)
				).toBe(true);
			});
			test("cancel", async () => {
				const roomStore = useRoomStore();

				roomStore.setDataFromResponse({
					...initialRoomStoreState,
					x: null,
					o: "T2",
				});

				global.confirm = vitest.fn(() => false);

				expect(
					await onBeforeRoomLeave(
						{ query: { error: ErrorMessage.ROOM_FULL } },
						"TST",
						roomStore
					)
				).toBe(true);
			});
		});
	});
});
