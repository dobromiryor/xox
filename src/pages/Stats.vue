<script setup lang="ts">
import { onMounted } from "vue";
import Display from "~/components/atoms/Display.vue";
import LinkButton from "~/components/atoms/LinkButton.vue";
import Loader from "~/components/atoms/Loader.vue";
import { useNameStore } from "~/stores/name.store";
import { useStatsStore } from "~/stores/stats.store";
import { getStats } from "~/supabase/api/stats.api";
import { PlayerStats } from "~/types/playerStats.type";

const statsStore = useStatsStore();
const nameStore = useNameStore();

const winLossRatio = (stats: PlayerStats) => {
  return stats.totalWins === 0 && stats.totalLosses === 0
    ? 0
    : stats.totalWins !== 0 && stats.totalLosses === 0
    ? stats.totalWins
    : stats.totalWins / stats.totalLosses;
};

const byWinLossRatio = (a: PlayerStats, b: PlayerStats) => {
  return winLossRatio(b) - winLossRatio(a);
};

onMounted(async () => {
  nameStore.setPersistedName();
  await getStats();
});
</script>

<template>
  <main class="flex h-full w-full p-2 overflow-y-auto">
    <div
      :class="{
        'before:absolute before:-top-[2px] before:-left-[2px] before:flex before:flex-col before:w-[calc(100%_+_4px)] before:h-[calc(100%_+_4px)] before:rounded-xl before:shadow-2xl before:bg-gradient-to-b before:from-gray-300 before:via-bg-secondary before:to-gray-700 before:from-[-100%] before:to-[200%] before:-z-10': true,
        /*  */
        'relative flex-1 flex flex-col justify-between gap-3 w-[calc(100%_-_4px)] max-w-lg min-h-[412px] max-h-[700px] m-auto p-4 bg-bg-secondary rounded-xl z-auto': true,
      }"
    >
      <Display class="flex-1 justify-stretch items-baseline overflow-auto">
        <Loader v-if="statsStore.isLoading" class="self-center mx-auto" />
        <table v-else class="flex-1 border-spacing-4 text-center">
          <thead>
            <tr>
              <th scope="col">Player</th>
              <th scope="col">Games</th>
              <th scope="col">Finished</th>
              <th scope="col">Won</th>
              <th scope="col">Lost</th>
              <th scope="col">Tied</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Total</th>
              <td>{{ statsStore.totalGames }}</td>
              <td>{{ statsStore.totalFinishedGames }}</td>
              <td>{{ statsStore.totalWins }}</td>
              <td>{{ statsStore.totalWins }}</td>
              <td>{{ statsStore.totalTies }}</td>
            </tr>
            <tr
              v-for="player in statsStore.players.sort(byWinLossRatio)"
              :class="{
                'bg-white text-zinc-900': nameStore.name === player.name,
              }"
            >
              <th scope="row">{{ player.name }}</th>
              <td>{{ player.totalGames }}</td>
              <td>{{ player.totalFinishedGames }}</td>
              <td>{{ player.totalWins }}</td>
              <td>{{ player.totalLosses }}</td>
              <td>{{ player.totalTies }}</td>
            </tr>
          </tbody>
        </table>
      </Display>
      <LinkButton>Home</LinkButton>
    </div>
  </main>
</template>
