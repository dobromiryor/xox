import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RouteLocationNormalizedGeneric } from "vue-router";
import { ErrorMessage } from "~/enums/error.enum";
import { useNameStore } from "~/stores/name.store";
import { findRoomByName } from "~/supabase/api/room.api";
import { roomGuard } from "./room.guard";

vi.mock("~/stores/name.store", () => ({
  useNameStore: vi.fn().mockReturnValue({
    name: "TST",
    setPersistedName: vi.fn(),
  }),
}));

vi.mock("~/supabase/api/room.api", () => ({
  findRoomByName: vi.fn().mockResolvedValue({
    data: {
      x: "TST",
      o: "TS2",
      room_name: "test-room-name",
    },
  }),
}));

describe("roomGuard", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();
  });

  test("redirects to root page with error message when user has no name", async () => {
    vi.mocked(useNameStore).mockReturnValue({
      name: "",
      0: 0,
      1: 0,
      2: 0,
      setPersistedName: vi.fn(),
    } as unknown as ReturnType<typeof useNameStore>);

    const to = {
      params: { room_name: "test-room-name" },
    };
    const result = await roomGuard(
      to as unknown as RouteLocationNormalizedGeneric
    );

    expect(result).toEqual({
      path: "/",
      query: {
        error:
          Object.keys(ErrorMessage)[
            Object.values(ErrorMessage).indexOf(ErrorMessage.NAME)
          ],
        room: to.params.room_name as string,
      },
    });
  });

  test("redirects to root page with error message when room does not exist", async () => {
    vi.mocked(useNameStore).mockReturnValue({
      name: "TST",
      setPersistedName: vi.fn(),
    } as unknown as ReturnType<typeof useNameStore>);

    const to = { params: { room_name: "test-room-name" } };
    vi.mocked(findRoomByName).mockResolvedValue({ data: null });
    const result = await roomGuard(
      to as unknown as RouteLocationNormalizedGeneric
    );

    expect(result).toEqual({
      path: "/",
      replace: true,
      query: {
        error:
          Object.keys(ErrorMessage)[
            Object.values(ErrorMessage).indexOf(
              ErrorMessage.ROOM_DOES_NOT_EXIST
            )
          ],
      },
    });
  });

  test("redirects to root page with error message when room is full", async () => {
    const to = { params: { room_name: "test-room-name" } };
    vi.mocked(useNameStore).mockReturnValue({
      name: "TS3",
      setPersistedName: vi.fn(),
    } as unknown as ReturnType<typeof useNameStore>);
    vi.mocked(findRoomByName).mockResolvedValue({
      data: {
        x: "TST",
        o: "TS2",
        room_name: "test-room-name",
        board: [[], [], []],
        created_at: "",
        id: 1,
        result: "X",
        turn: "X",
      },
    });
    const result = await roomGuard(
      to as unknown as RouteLocationNormalizedGeneric
    );
    expect(result).toEqual({
      path: "/",
      replace: true,
      query: {
        error:
          Object.keys(ErrorMessage)[
            Object.values(ErrorMessage).indexOf(ErrorMessage.ROOM_FULL)
          ],
        room: to.params.room_name as string,
      },
    });
  });

  test("does not redirect when user has a name and room exists and is not full", async () => {
    vi.mocked(useNameStore).mockReturnValue({
      name: "TST",
      setPersistedName: vi.fn(),
    } as unknown as ReturnType<typeof useNameStore>);
    const to = { params: { room_name: "test-room-name" } };
    const result = await roomGuard(
      to as unknown as RouteLocationNormalizedGeneric
    );

    expect(result).toBeUndefined();
  });
});
