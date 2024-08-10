import { Mark } from "~/enums/mark.enum";
import { useStatsStore } from "~/stores/stats.store";
import { supabase } from "~/supabase/supabaseClient";
import { RoomRow } from "~/types/room.types";

export const getStats = async () => {
  const statsStore = useStatsStore();

  statsStore.$reset();

  const { data } = await supabase.from("rooms").select();

  if (data) {
    data.forEach((room) => {
      statsStore.totalGames++;

      /* overall stats */
      if (room.result) {
        statsStore.totalFinishedGames++;

        if (room.result === "TIE") {
          statsStore.totalTies++;
        } else {
          statsStore.totalWins++;
        }
      }

      /* player stats */
      if (room.result) {
        switch (room.result) {
          case "TIE":
            updateTie(room);
            break;
          case "X":
            updateWin(room, Mark.X);
            break;
          case "O":
            updateWin(room, Mark.O);
            break;
        }
      }
    });
  }

  statsStore.isLoading = false;
};

const pushInitialPlayer = (room: RoomRow, mark: Mark) => {
  const statsStore = useStatsStore();

  if (room.x && mark === Mark.X) {
    statsStore.players.push({
      name: room.x,
      totalFinishedGames: room.result ? 1 : 0,
      totalGames: 1,
      totalLosses: room.result === "O" ? 1 : 0,
      totalTies: room.result === "TIE" ? 1 : 0,
      totalWins: room.result === "X" ? 1 : 0,
    });
  }

  if (room.o && Mark.O) {
    statsStore.players.push({
      name: room.o,
      totalFinishedGames: room.result ? 1 : 0,
      totalGames: 1,
      totalLosses: room.result === "X" ? 1 : 0,
      totalTies: room.result === "TIE" ? 1 : 0,
      totalWins: room.result === "O" ? 1 : 0,
    });
  }
};

const updateTie = (room: RoomRow) => {
  const statsStore = useStatsStore();

  let foundX = statsStore.players.find((player) => player.name === room.x);
  let foundO = statsStore.players.find((player) => player.name === room.o);

  if (!foundX) pushInitialPlayer(room, Mark.X);
  if (!foundO) pushInitialPlayer(room, Mark.O);

  const filteredPlayers = statsStore.players.filter(
    (player) => player.name !== foundX?.name && player.name !== foundO?.name
  );

  foundX != undefined && foundX.totalTies++;
  foundX != undefined && foundX.totalGames++;
  foundX != undefined && room.result !== null && foundX.totalFinishedGames++;

  foundO != undefined && foundO.totalTies++;
  foundO != undefined && foundO.totalGames++;
  foundO != undefined && room.result !== null && foundO.totalFinishedGames++;

  statsStore.players = [...filteredPlayers];

  foundX != undefined && statsStore.players.push(foundX);
  foundO != undefined && statsStore.players.push(foundO);
};

const updateWin = (room: RoomRow, mark: Mark) => {
  const statsStore = useStatsStore();

  let foundX = statsStore.players.find((player) => player.name === room.x);
  let foundO = statsStore.players.find((player) => player.name === room.o);

  if (!foundX) pushInitialPlayer(room, Mark.X);
  if (!foundO) pushInitialPlayer(room, Mark.O);

  const filteredPlayers = statsStore.players.filter(
    (player) => player.name !== foundX?.name && player.name !== foundO?.name
  );

  if (mark === Mark.X) {
    foundX != undefined && foundX.totalWins++;
    foundO != undefined && foundO.totalLosses++;
  } else {
    foundX != undefined && foundX.totalLosses++;
    foundO != undefined && foundO.totalWins++;
  }

  foundX != undefined && foundX.totalGames++;
  foundX != undefined && room.result !== null && foundX.totalFinishedGames++;

  foundO != undefined && foundO.totalGames++;
  foundO != undefined && room.result !== null && foundO.totalFinishedGames++;

  statsStore.players = [...filteredPlayers];

  foundX != undefined && statsStore.players.push(foundX);
  foundO != undefined && statsStore.players.push(foundO);
};
