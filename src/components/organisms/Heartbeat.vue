<script setup lang="ts">
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { onMounted, onUnmounted, ref } from "vue";
import { useNameStore } from "~/stores/name.store";
import { supabase } from "~/supabase/supabaseClient";
const nameStore = useNameStore();

const latency = ref(0);

const heartbeatChannel = supabase.channel(`heartbeat:${nameStore.name}`, {
  config: {
    broadcast: { ack: true },
  },
});

let heartbeatIntervalId: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  heartbeatChannel.subscribe((status) => {
    if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
      heartbeatIntervalId = setInterval(async () => {
        const start = performance.now();
        const resp = await heartbeatChannel.send({
          type: "broadcast",
          event: "heartbeat",
          payload: {},
        });

        if (resp !== "ok") {
          console.error("heartbeat broadcast error");
          latency.value = -1;
        } else {
          const end = performance.now();
          latency.value = end - start;
        }
      }, 1000);
    }
  });
});

onUnmounted(async () => {
  await heartbeatChannel.unsubscribe();
  await supabase.removeChannel(heartbeatChannel);
  clearInterval(heartbeatIntervalId);
});
</script>

<template>
  <div
    class="fixed bottom-4 left-4 z-50 px-1 py-0.5 select-none text-xs rounded"
    :class="{
      'bg-red-800 text-white': latency < 0,
      'bg-transparent text-green-900': latency >= 0,
    }"
  >
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      leave-active-class="transition-all duration-300"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <button v-if="latency < 0" @click="() => $router.go(0)">refresh</button>
      <p v-else>
        {{ latency.toFixed() }}
      </p>
    </Transition>
  </div>
</template>
