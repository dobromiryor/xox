<script setup lang="ts">
import ShareRoom from "~/components/atoms/ShareRoom.vue";
import Heartbeat from "~/components/organisms/Heartbeat.vue";
import Game from "~/components/templates/Game.vue";

import ResultPlugin from "~/components/templates/ResultPlugin.vue";
</script>

<template>
	<main
		class="grow shrink basis-auto flex flex-col w-full min-h-0 p-2 overflow-y-auto"
	>
		<div
			class="relative flex flex-col-reverse items-center m-auto w-full transition-all"
		>
			<ResultPlugin />
			<Game />
		</div>

		<Heartbeat />
		<ShareRoom />
	</main>
</template>
