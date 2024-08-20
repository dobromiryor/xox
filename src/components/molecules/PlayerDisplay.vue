<script setup lang="ts">
import Display from "~/components/atoms/Display.vue";
import Loader from "~/components/atoms/Loader.vue";
import { Mark } from "~/enums/mark.enum";
import { useRoomStore } from "~/stores/room.store";

const { mark } = defineProps<{ mark: Mark | undefined }>();

const roomStore = useRoomStore();
</script>

<template>
	<Display>
		<div class="relative flex justify-center items-center min-w-6 h-full">
			<p
				v-if="mark"
				class="-translate-y-[3px] text-[32px] leading-[calc(2/3)] bg-clip-text transition-all duration-500"
				:class="{
					...(roomStore.turn === mark && !!!roomStore.result
						? {
								'text-white/0 bg-white/0 bg-gradient-to-br from-50%': true,
								'from-primary to-primary-accent': mark === Mark.X,
								'from-secondary to-secondary-accent': mark === Mark.O,
							}
						: {
								'text-white bg-white': true,
							}),
				}"
			>
				{{ mark.toLocaleLowerCase() ?? "" }}
			</p>
			<Loader v-else />
		</div>
		<div class="relative flex justify-center items-center min-w-[60px]">
			<p v-if="mark">
				{{ roomStore[mark?.toLocaleLowerCase() as keyof typeof roomStore] }}
			</p>
			<p aria-label="Waiting for player" v-else>---</p>
		</div>
	</Display>
</template>
