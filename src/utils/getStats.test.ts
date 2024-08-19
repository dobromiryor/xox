import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStatsStore } from "~/stores/stats.store";
import { getAllRooms } from "~/supabase/api/room.api";
import { RoomRow } from "~/types/room.types";
import { getStats } from "./getStats";

describe("getStats", () => {
  vi.mock("~/supabase/api/room.api", () => ({
    getAllRooms: vi.fn().mockResolvedValue({
      data: [],
    }),
  }));

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("returns an empty array when there are no rooms", async () => {
    const result = await getStats();
    expect(result).toEqual([]);
  });

  it("returns an array of player statistics when there are rooms with tie results", async () => {
    vi.mocked(getAllRooms).mockResolvedValueOnce({
      data: [
        { result: "TIE", x: "P2", o: "P1" } as RoomRow,
        { result: "TIE", x: "P1", o: "P2" } as RoomRow,
      ],
    });

    const result = await getStats();
    expect(result).toEqual([
      {
        name: "P1",
        totalGames: 2,
        totalFinishedGames: 2,
        totalTies: 2,
        totalWins: 0,
        totalLosses: 0,
      },
      {
        name: "P2",
        totalGames: 2,
        totalFinishedGames: 2,
        totalTies: 2,
        totalWins: 0,
        totalLosses: 0,
      },
    ]);
  });

  it("returns an array of player statistics when there are rooms with win results", async () => {
    vi.mocked(getAllRooms).mockResolvedValueOnce({
      data: [
        { result: "O", x: "P1", o: "P2" },
        { result: "X", x: "P2", o: "P1" },
      ] as RoomRow[],
    });

    const result = await getStats();
    expect(result).toEqual([
      {
        name: "P2",
        totalGames: 2,
        totalFinishedGames: 2,
        totalTies: 0,
        totalWins: 2,
        totalLosses: 0,
      },
      {
        name: "P1",
        totalGames: 2,
        totalFinishedGames: 2,
        totalTies: 0,
        totalWins: 0,
        totalLosses: 2,
      },
    ]);
  });

  it("sets isLoading to true before fetching rooms and false after", async () => {
    const statsStore = useStatsStore();

    await getStats();
    expect(statsStore.isLoading).toBe(false);
  });

  it("resets statsStore before calculating statistics", async () => {
    const statsStore = useStatsStore();
    statsStore.totalGames = 10;
    statsStore.totalFinishedGames = 10;
    statsStore.totalTies = 10;
    statsStore.totalWins = 10;

    await getStats();
    expect(statsStore.totalGames).toBe(0);
    expect(statsStore.totalFinishedGames).toBe(0);
    expect(statsStore.totalTies).toBe(0);
    expect(statsStore.totalWins).toBe(0);
  });

  it("handles rooms with no result", async () => {
    vi.mocked(getAllRooms).mockResolvedValueOnce({
      data: [{ result: null }, { result: undefined }] as RoomRow[],
    });

    const result = await getStats();
    expect(result).toEqual([]);
  });

  it("handles rooms with invalid result", async () => {
    vi.mocked(getAllRooms).mockResolvedValueOnce({
      data: [{ result: "INVALID" } as unknown] as RoomRow[],
    });
    const result = await getStats();
    expect(result).toEqual([]);
  });
});
