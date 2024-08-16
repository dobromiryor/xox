<script lang="ts" setup>
import {
REALTIME_LISTEN_TYPES,
REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
REALTIME_PRESENCE_LISTEN_EVENTS,
RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import EmojiDisplay from "~/components/molecules/EmojiDisplay.vue";
import PlayerDisplay from "~/components/molecules/PlayerDisplay.vue";
import EmojiPanel from "~/components/organisms/EmojiPanel.vue";
import { ErrorMessage } from "~/enums/error.enum";
import { Mark } from "~/enums/mark.enum";
import { useEmojiStore } from "~/stores/emoji.store";
import { useNameStore } from "~/stores/name.store";
import { useRoomStore } from "~/stores/room.store";
import { findRoomByName, updateRoomByName } from "~/supabase/api/room.api";
import { supabase } from "~/supabase/supabaseClient";
import { Player } from "~/types/player.type";
import { RoomRow } from "~/types/room.types";
import { onBeforeRoomLeave } from "~/utils/onBeforeRoomLeave";
import Board from "../organisms/Board.vue";

const roomStore = useRoomStore();
const nameStore = useNameStore();
const emojiStore = useEmojiStore();

const { params } = useRoute();
const router = useRouter();

const room = supabase.channel(params.room_name as string, {
  config: {
    broadcast: { self: true },
    presence: { key: params.room_name as string },
  },
});

onMounted(() => {
  room

    /* ON JOIN */
    .on(
      REALTIME_LISTEN_TYPES.PRESENCE,
      { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN },
      (payload) => {
        const { key, newPresences } = payload;

        const presences = room.presenceState<Player>() ?? [];

        newPresences.forEach(async (newPresence) => {
          if (nameStore.name === newPresence.name) {
            /* only for the new presence */

            const sameNamePlayers = presences?.[key]?.filter(
              (presence) => presence.name === newPresence.name
            );

            if (sameNamePlayers?.length > 1) {
              sameNamePlayers?.forEach((player, index) => {
                /* kick duplicating presence */
                if (
                  player.presence_ref === newPresence.presence_ref &&
                  index !== 0
                ) {
                  return router.push({
                    path: "/",
                    replace: true,
                    query: {
                      error:
                        Object.keys(ErrorMessage)[
                          Object.values(ErrorMessage).indexOf(
                            ErrorMessage.NAME_TAKEN
                          )
                        ],
                      room: params.room_name as string,
                    },
                  });
                }
              });
            }

            if (roomStore.x !== newPresence.name && !roomStore.o) {
              /* update presence's sign */
              await updateRoomByName(roomStore.room_name!, {
                o: newPresence.name,
              });
            }
          }
        });
      }
    )

    /* ON SYNC */
    .on(
      REALTIME_LISTEN_TYPES.PRESENCE,
      { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
      () => {
        const presences =
          room.presenceState<Player>()[params.room_name as string];

        roomStore.players = presences?.map((presence) => ({
          name: presence.name,
          presence_ref: presence.presence_ref,
          mark: presence.mark,
        }));
      }
    )

    /* ON DATABASE CHANGE */
    .on(
      REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
      {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
        schema: "public",
        table: "rooms",
        filter: `room_name=eq.${roomStore.room_name}`,
      },
      (payload: RealtimePostgresChangesPayload<RoomRow>) => {
        if ("id" in payload.new) {
          roomStore.setDataFromResponse(payload.new);
        }
      }
    )

    /* ON EMOJI */
    .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: "emoji" }, ({ payload }) => {
      emojiStore.setLastEmoji(payload.emojiKey, payload.from);
    })

    /* ON NEW GAME */
    .on(
      REALTIME_LISTEN_TYPES.BROADCAST,
      { event: "new_game" },
      async ({ payload }) => {
        if (roomStore.room_name !== payload.room_name) {
          await findRoomByName(payload.room_name);
        }

        emojiStore.clearEmojis();

        router.push({
          path: `/r/${payload.room_name}`,
          replace: true,
          force: true,
        });
      }
    )

    .subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;

      await room.track({
        name: nameStore.name,
        mark: roomStore.x === nameStore.name ? Mark.X : Mark.O,
      });
    });
});
onUnmounted(() => supabase.removeAllChannels());

onBeforeRouteLeave(
  async (leaveGuard) =>
    await onBeforeRoomLeave(leaveGuard, nameStore.name, roomStore)
);
</script>

<template>
  <div
    :class="{
      'before:absolute before:-top-[2px] before:-left-[2px] before:flex before:flex-col before:w-[calc(100%_+_4px)] before:h-[calc(100%_+_4px)] before:rounded-xl before:shadow-2xl before:bg-gradient-to-b before:from-gray-300 before:via-bg-secondary before:to-gray-700 before:from-[-100%] before:to-[200%] before:-z-[1]': true,
      /*  */
      'relative flex flex-col gap-3 w-[calc(100%_-_4px)] max-w-lg my-[3px] p-4 bg-bg-secondary rounded-xl z-auto': true,
    }"
  >
    <div class="flex gap-2">
      <PlayerDisplay :mark="roomStore.opponent?.mark" />
      <EmojiDisplay :mark="roomStore.opponent?.mark" />
    </div>
    <Board />
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        <PlayerDisplay :mark="roomStore.player?.mark" />
        <EmojiDisplay :mark="roomStore.player?.mark" />
      </div>

      <EmojiPanel />
    </div>
  </div>
</template>
