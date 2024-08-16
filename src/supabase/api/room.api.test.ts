import { useRoomStore } from "~/stores/room.store";
import { InsertRoom } from "~/types/room.types";
import { insertRoom } from "./room.api";

import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("insertRoom", () => {
  vi.mock("~/supabase/supabaseClient", () => ({
    supabase: {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 1 } }),
            }),
          }),
        }),
      }),
    },
  }));

  vi.mock("~/stores", () => ({
    useNameStore: vi.fn().mockReturnValue({ name: "TST" }),
    useRoomStore: vi.fn().mockReturnValue({
      isLoading: false,
      setDataFromResponse: vi.fn(),
    }),
  }));

  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();
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
});
