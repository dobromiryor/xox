<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "~/components/atoms/Button.vue";
import LinkButton from "~/components/atoms/LinkButton.vue";
import { ErrorMessage } from "~/enums/error.enum";
import { useNameStore } from "~/stores/name.store";
import { insertRoom } from "~/supabase/api/room.api";

const route = useRoute();
const router = useRouter();

const nameStore = useNameStore();

const isLoadingState = ref(false);

const createRoom = async () => {
  router.replace({ query: null! });
  if (nameStore.name) {
    isLoadingState.value = true;
    const { data, isLoading } = await insertRoom();
    isLoadingState.value = isLoading;

    localStorage.setItem("xox", nameStore.name);

    router.push(`/r/${data?.room_name}`);
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
    <LinkButton to="/stats">Stats</LinkButton>
    <Button class="w-full" :disabled="isLoadingState" @click="createRoom"
      >New game</Button
    >
  </div>
</template>
