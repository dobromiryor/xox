import { computed } from "@vue/reactivity";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNameStore = defineStore("name", () => {
	const dictionary = " ABCDEFGHIJKLMNOPQRSTUXYZ0123456789";

	const firstLetter = ref(0);
	const secondLetter = ref(0);
	const thirdLetter = ref(0);

	const name = computed(() => {
		if (
			firstLetter.value === 0 &&
			secondLetter.value === 0 &&
			thirdLetter.value === 0
		) {
			return null;
		}

		return (
			dictionary[firstLetter.value] +
			dictionary[secondLetter.value] +
			dictionary[thirdLetter.value]
		);
	});

	const setPersistedName = () => {
		const persistedName = localStorage.getItem("xox");
		if (persistedName) {
			firstLetter.value = dictionary.includes(persistedName[0])
				? dictionary.indexOf(persistedName[0])
				: 0;
			secondLetter.value = dictionary.includes(persistedName[1])
				? dictionary.indexOf(persistedName[1])
				: 0;
			thirdLetter.value = dictionary.includes(persistedName[2])
				? dictionary.indexOf(persistedName[2])
				: 0;
		}
	};

	return {
		0: firstLetter,
		1: secondLetter,
		2: thirdLetter,
		dictionary,
		name,
		setPersistedName,
	};
});
