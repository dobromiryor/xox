import { Mark } from "~/enums/mark.enum";
import { useStatsStore } from "~/stores/stats.store";
import { getAllRooms } from "~/supabase/api/room.api";
import { PlayerStats } from "~/types/playerStats.type";
import { RoomRow } from "~/types/room.types";

/**
 * Retrieves and calculates player statistics from all rooms.
 *
 * @return {Promise<PlayerStats[]>} An array of player statistics.
 */
export const getStats = async (): Promise<PlayerStats[]> => {
  const statsStore = useStatsStore();

  statsStore.$reset();

  statsStore.isLoading = true;

  const { data: rooms } = await getAllRooms();

  if (rooms) {
    rooms.forEach((room) => {
      statsStore.totalGames++;

      if (room.result) {
        statsStore.totalFinishedGames++;

        switch (room.result) {
          case "TIE":
            statsStore.totalTies++;
            updateTie(room);
            break;
          case "X":
          case "O":
            statsStore.totalWins++;
            updateWin(room, room.result as Mark);
            break;
          default:
            break;
        }
      }
    });
  }

  statsStore.isLoading = false;

  return statsStore.players;
};

/**
 * Initializes player statistics for a given room and mark.
 *
 * @param {RoomRow} room - The room to initialize player statistics for.
 * @param {Mark} mark - The mark of the player to initialize statistics for.
 * @return {void}
 */
const initializePlayerStats = (room: RoomRow, mark: Mark): void => {
  const statsStore = useStatsStore();

  const player = mark === Mark.X ? room.x : room.o;

  if (player) {
    statsStore.players.push({
      name: player,
      totalFinishedGames: room.result ? 1 : 0,
      totalGames: 1,
      totalLosses: room.result === getOpponentMark(mark) ? 1 : 0,
      totalTies: room.result === "TIE" ? 1 : 0,
      totalWins: room.result === mark ? 1 : 0,
    });
  }
};

/**
 * Returns the opponent mark for a given mark.
 *
 * @param {Mark} mark - The mark to get the opponent mark for.
 * @return {Mark} The opponent mark for the given mark.
 */
const getOpponentMark = (mark: Mark): Mark =>
  mark === Mark.X ? Mark.O : Mark.X;

/**
 * Updates the statistics for a tie game.
 *
 * @param {RoomRow} room - The room to update the tie statistics for.
 * @return {void}
 */
const updateTie = (room: RoomRow): void => {
  const statsStore = useStatsStore();

  const xPlayer = statsStore.players.find((player) => player.name === room.x);
  const oPlayer = statsStore.players.find((player) => player.name === room.o);

  if (!xPlayer) {
    initializePlayerStats(room, Mark.X);
  }
  if (!oPlayer) {
    initializePlayerStats(room, Mark.O);
  }

  const filteredPlayers = statsStore.players.filter(
    (player) => player.name !== xPlayer?.name && player.name !== oPlayer?.name
  );

  if (xPlayer) {
    xPlayer.totalTies++;
    xPlayer.totalGames++;
    if (room.result !== null) {
      xPlayer.totalFinishedGames++;
    }
  }

  if (oPlayer) {
    oPlayer.totalTies++;
    oPlayer.totalGames++;
    if (room.result !== null) {
      oPlayer.totalFinishedGames++;
    }
  }

  statsStore.players = [...filteredPlayers];

  if (xPlayer) {
    statsStore.players.push(xPlayer);
  }
  if (oPlayer) {
    statsStore.players.push(oPlayer);
  }
};

/**
 * Updates the statistics for a winning game.
 *
 * @param {RoomRow} room - The room to update the win statistics for.
 * @param {Mark} mark - The mark of the winning player.
 * @return {void}
 */
const updateWin = (room: RoomRow, mark: Mark): void => {
  const statsStore = useStatsStore();

  const xPlayer = statsStore.players.find((player) => player.name === room.x);
  const oPlayer = statsStore.players.find((player) => player.name === room.o);

  if (!xPlayer) {
    initializePlayerStats(room, Mark.X);
  }
  if (!oPlayer) {
    initializePlayerStats(room, Mark.O);
  }

  const filteredPlayers = statsStore.players.filter(
    (player) => player.name !== xPlayer?.name && player.name !== oPlayer?.name
  );

  if (xPlayer) {
    incrementPlayerStats(xPlayer, mark);
  }

  if (oPlayer) {
    incrementPlayerStats(oPlayer, mark === Mark.X ? Mark.O : Mark.X);
  }

  statsStore.players = [...filteredPlayers];

  if (xPlayer) {
    statsStore.players.push(xPlayer);
  }
  if (oPlayer) {
    statsStore.players.push(oPlayer);
  }
};

/**
 * Increments the statistics for a player based on the game outcome.
 *
 * @param {PlayerStats} player - The player to update the statistics for.
 * @param {Mark} mark - The mark of the player, indicating the game outcome.
 * @return {void}
 */
const incrementPlayerStats = (player: PlayerStats, mark: Mark): void => {
  player.totalGames++;
  if (mark === Mark.X) {
    player.totalWins++;
  } else {
    player.totalLosses++;
  }
  if (player.totalGames > 0) {
    player.totalFinishedGames++;
  }
};
