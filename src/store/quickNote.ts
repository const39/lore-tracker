import { SerializedState } from "@/js/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useQuickNoteStore = defineStore("quickNote", () => {
	const content = ref("");

	const serializableState = computed(() => ({ quickNote: content }));

	function $reset() {
		content.value = "";
	}

	function $hydrate(payload: SerializedState) {
		content.value = payload.quickNote;
	}

	return { content, serializableState, $reset, $hydrate };
});
