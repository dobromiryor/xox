<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "~/components/atoms/Button.vue";
import Input from "~/components/atoms/Input.vue";
import { ErrorMessage } from "~/enums/error.enum";
import { useNameStore } from "~/stores/name.store";
import { useRoomStore } from "~/stores/room.store";

const route = useRoute();
const router = useRouter();

const nameStore = useNameStore();
const roomStore = useRoomStore();

const roomInput = ref(route.query.room ?? "");

watch(
  () => route.query,
  () => {
    /* populate room input on error */
    if (!!route.query.room) {
      roomInput.value = route.query.room;
    }
  }
);

const joinRoom = async () => {
  router.replace({ query: null! });
  if (nameStore.name) {
    if (!!roomInput.value) {
      localStorage.setItem("xox", nameStore.name);

      router.push(`/r/${roomInput.value}`);
    } else {
      router.push({
        query: {
          error:
            Object.keys(ErrorMessage)[
              Object.values(ErrorMessage).indexOf(
                ErrorMessage.ROOM_DOES_NOT_EXIST
              )
            ],
        },
      });
    }
  } else {
    router.push({
      query: {
        error:
          Object.keys(ErrorMessage)[
            Object.values(ErrorMessage).indexOf(ErrorMessage.NAME)
          ],
      },
    });
  }
};
</script>

<template>
  <div class="flex-1 flex flex-col justify-end gap-2">
    <Input
      aria-label="Room name"
      :value="roomInput"
      @input="(event) => (roomInput = event.target.value)"
    />
    <Button :disabled="roomStore.isLoading" @click="joinRoom">Join game</Button>
  </div>
</template>
