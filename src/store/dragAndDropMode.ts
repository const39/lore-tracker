import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { UnionOfTupleValues } from "@/core/utils/types";
import { useFilterStore } from "./filter";
import { usePreferencesStore } from "./preferences";

/**
 * Tuple of drag & drop mode values.
 */
export const ModeValues = ["disabled", "moveToFolder", "sort", "link"] as const;
export type DragAndDropMode = UnionOfTupleValues<typeof ModeValues>;

type DisabledModes = Exclude<DragAndDropMode, "disabled">[] | "all" | "none";

export const useDragAndDropMode = defineStore("dragAndDropMode", () => {
	const _prefStore = usePreferencesStore();
	const _filterStore = useFilterStore();

	// Current state
	const mode = ref<DragAndDropMode>("disabled");
	const disabledModes = ref<DisabledModes>("none");

	// Exposed readonly state
	const readonlyMode = computed(() => mode.value);
	const readonlyDisabledModes = computed(() => disabledModes.value);

	watch(
		[() => _prefStore.cardsOrder, () => _filterStore.isFilterActive, () => mode.value],
		([order, filter, currentMode]) => {
			// Disable some modes based on current context
			if (currentMode === "link") disabledModes.value = "all";
			else if (order === "alphanumeric" || !!filter) disabledModes.value = ["sort"];
			else disabledModes.value = "none";

			// Reset drag & drop sort state if the current mode is disabled (except if it is the 'link' mode)
			if (_isModeDisabled(currentMode) && currentMode !== "link") mode.value = "disabled";
		},
		{ immediate: true }
	);

	/**
	 * Check if the specified mode is currently disabled.
	 * @param arg the mode to check
	 * @returns true if the specified mode is disabled, false otherwise.
	 */
	function _isModeDisabled(arg: DragAndDropMode) {
		if (arg === "disabled") return false;
		return disabledModes.value === "all" || disabledModes.value.includes(arg);
	}

	/**
	 * Set the current drag & drop mode.
	 *
	 * If the specified mode is currently disabled, this function has no effect.
	 *
	 * @param arg the mode to set
	 */
	function setMode(arg: DragAndDropMode) {
		if (!_isModeDisabled(arg)) mode.value = arg;
	}

	return {
		mode: readonlyMode,
		disabledModes: readonlyDisabledModes,
		setMode,
	};
});
