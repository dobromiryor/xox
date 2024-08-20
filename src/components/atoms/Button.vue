<script setup lang="ts">
withDefaults(
	defineProps<{
		style?: "bg" | "accent" | "primary" | "secondary";
	}>(),
	{
		style: "bg",
	}
);
</script>

<template>
	<div class="relative z-10" @click.prevent="true">
		<button
			v-bind="$attrs"
			@click.stop
			:class="[
				{
					bg: {
						'before:bg-zinc-900': true,
						'bg-gradient-to-b from-zinc-600 via-bg to-zinc-900 text-white': true,
						'after:bg-bg': true,
					},
					accent: {
						'before:bg-gray-700': true,
						'bg-gradient-to-b from-gray-400 via-bg-secondary to-gray-700 text-white': true,
						'after:bg-bg-secondary': true,
					},
					primary: {
						'before:bg-sky-600': true,
						'bg-gradient-to-b from-sky-300 via-primary to-sky-600 text-white': true,
						'after:bg-primary': true,
					},
					secondary: {
						'before:bg-amber-600': true,
						'bg-gradient-to-b from-amber-300 via-secondary to-amber-600 text-black': true,
						'after:bg-secondary': true,
					},
				}[style],
				{
					/* before */
					'before:absolute before:w-full before:h-full before:rounded-md before:top-0.5 before:hover:top-[1px] before:focus:top-[1px] before:disabled:top-0 before:active:top-0 before:-left-[1px] before:border before:border-black before:transition-all before:duration-300 before:origin-center before:box-content before:-z-10': true,
					/* element */
					'relative -top-1 hover:-top-[3px] hover:-focus-[3px] disabled:-top-0.5 active:-top-0.5 left-0 flex justify-center items-center w-full h-full px-2 py-1 after:border after:border-transparent rounded-md transition-all duration-300 origin-center': true,
					/* after */
					'after:absolute after:top-[1px] after:left-[1px] after:w-[calc(100%_-_2px)] after:h-[calc(100%_-_2px)] after:rounded-md after:z-auto after:transition-all after:duration-300 after:origin-center': true,
				},
			]"
		>
			<div class="z-10" @click.prevent="true">
				<slot></slot>
			</div>
		</button>
	</div>
</template>
