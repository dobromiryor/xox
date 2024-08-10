import { defineStore } from "pinia";
import { ref } from "vue";
import { PlayerStats } from "~/types/playerStats.type";

export const useStatsStore = defineStore("stats", () => {
  const isLoading = ref(true);
  const totalFinishedGames = ref(0);
  const totalGames = ref(0);
  const totalTies = ref(0);
  const totalWins = ref(0);

  const players = ref<PlayerStats[]>([]);

  const $reset = () => {
    isLoading.value = true;
    totalFinishedGames.value = 0;
    totalGames.value = 0;
    totalTies.value = 0;
    totalWins.value = 0;

    players.value = [];
  };

  return {
    isLoading,
    totalFinishedGames,
    totalGames,
    totalTies,
    totalWins,
    players,
    $reset,
  };
});
