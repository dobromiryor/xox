<script setup lang="ts">
import Display from "~/components/atoms/Display.vue";
import CreateGame from "~/components/organisms/CreateGame.vue";
import JoinGame from "~/components/organisms/JoinGame.vue";
import { ErrorMessage } from "~/enums/error.enum";
import PlayerName from "../components/molecules/PlayerName.vue";
</script>

<template>
	<main class="flex h-full w-full p-2 overflow-y-auto">
		<div
			:class="{
				'before:absolute before:-top-[2px] before:-left-[2px] before:flex before:flex-col before:w-[calc(100%_+_4px)] before:h-[calc(100%_+_4px)] before:rounded-xl before:shadow-2xl before:bg-gradient-to-b before:from-gray-300 before:via-bg-secondary before:to-gray-700 before:from-[-100%] before:to-[200%] before:-z-10': true,
				/*  */
				'relative flex flex-col justify-between gap-3 w-[calc(100%_-_4px)] max-w-lg h-0 min-h-[412px] max-h-[700px] m-auto p-4 bg-bg-secondary rounded-xl z-auto': true,
			}"
		>
			<Display :loader="true" loaderLabel="xox"
				><p
					aria-live="assertive"
					role="alert"
					v-if="!!ErrorMessage[($route.query.error as keyof typeof ErrorMessage)]"
				>
					{{
						ErrorMessage[
							$route.query.error as keyof typeof ErrorMessage
						].toLocaleUpperCase()
					}}
				</p>
			</Display>
			<PlayerName />
			<div class="flex flex-col gap-3 w-full min-[480px]:flex-row">
				<CreateGame />
				<JoinGame />
			</div>
		</div>
	</main>
</template>
