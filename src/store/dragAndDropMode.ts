import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { UnionOfTupleValues } from "@/core/utilities";
import { useFilterStore } from "./filter";
import { usePreferencesStore } from "./preferences";

export const ModeValues = ["disabled", "moveToFolder", "sort", "link"] as const;
export type DragAndDropMode = UnionOfTupleValues<typeof ModeValues>;

type DisabledModes = Exclude<DragAndDropMode, "disabled">[] | "all" | "none";

export const useDragAndDropMode = defineStore("dragAndDropMode", () => {
	const _prefStore = usePreferencesStore();
	const _filterStore = useFilterStore();

	const mode = ref<DragAndDropMode>("disabled");
	const disabledModes = ref<DisabledModes>("none");

	const readonlyMode = computed(() => mode.value);
	const readonlyDisabledModes = computed(() => disabledModes.value);

	watch(
		[() => _prefStore.cardsOrder, () => _filterStore.isFilterActive, () => mode.value],
		([order, filter, currentMode]) => {
			// Disable drag and drop 'sort' mode switch if:
			// - Cards are sorted automatically (i.e. not in custom order)
			// - A search filter is active
			// - Drag&drop is not already enabled in another mode
			disabledModes.value =
				order === "alphanumeric" || !!filter || currentMode === "link" ? "all" : "none";
			// if (mode.value === "link") disabledModes.value = "all";
			// else if (order === "alphanumeric" || !!filter) disabledModes.value = ["sort"];

			// if (order === "alphanumeric" || !!filter) disabledModes.value = ["sort"];
			// else disabledModes.value = "none";

			// Reset drag & drop sort state if the switch is disabled only if it is not already enabled in another mode
			if (disabledModes.value === "all" && mode.value !== "link") mode.value = "disabled";
		},
		{ immediate: true }
	);

	function setMode(arg: DragAndDropMode) {
		if (arg === "disabled") {
			mode.value = arg;
		} else if (disabledModes.value !== "all" && !disabledModes.value.includes(arg)) {
			mode.value = arg;
		}
	}

	return {
		mode: readonlyMode,
		disabledModes: readonlyDisabledModes,
		setMode,
	};
});
