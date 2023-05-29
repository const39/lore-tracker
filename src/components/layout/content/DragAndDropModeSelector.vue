<template>
	<div class="text-center">
		<div class="pa-2 text-right text-caption text-grey">
			<v-icon icon="mdi-selection-drag" />
			{{ $t("dragAndDrop.desc") }}
		</div>
		<div>
			<v-btn-toggle
				v-model="selected"
				:disabled="disableSelector"
				color="purple-lighten-1"
				variant="outlined"
				divided
				mandatory
			>
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn v-bind="props" :value="modes[0]" size="small" icon="mdi-cancel" />
					</template>
					{{ $t(`dragAndDrop.modes.${modes[0]}`) }}
				</v-tooltip>
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="modes[1]"
							size="small"
							icon="mdi-folder-move"
						/>
					</template>
					<div class="text-center">
						{{ $t(`dragAndDrop.modes.${modes[1]}`) }}
						<br>
						({{ $t("options.hotkeys.hold") + " Ctrl" }})
					</div>
				</v-tooltip>
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn v-bind="props" :value="modes[2]" size="small" icon="mdi-sort" />
					</template>
					<div class="text-center">
						{{ $t(`dragAndDrop.modes.${modes[2]}`) }}
						<br>
						({{ $t("options.hotkeys.hold") + " Ctrl+Alt" }})
					</div>
				</v-tooltip>
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="modes[3]"
							size="small"
							icon="mdi-link-variant"
							disabled
						/>
					</template>
					{{ $t(`dragAndDrop.modes.${modes[3]}`) }}
				</v-tooltip>
			</v-btn-toggle>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onKeyStroke, onKeyUp } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { t as $t } from "@/core/translation";
import { useFilterStore } from "@/store/filter";
import { usePreferencesStore, type DragAndDropMode } from "@/store/preferences";

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();

const modes: DragAndDropMode[] = ["disabled", "moveToFolder", "sort", "link"];

const disableSelector = ref(true);

const selected = computed({
	get() {
		return prefStore.dragAndDropMode;
	},
	set(value) {
		prefStore.dragAndDropMode = value;
	},
});

watch(
	[() => prefStore.cardsOrder, () => filterStore.isFilterActive, () => prefStore.dragAndDropMode],
	([order, filter, mode]) => {
		// Disable drag and drop 'sort' mode switch if:
		// - Cards are sorted automatically (i.e. not in custom order)
		// - A search filter is active
		// - Drag&drop is not already enabled in another mode
		disableSelector.value = order === "alphanumeric" || !!filter || mode === "link";

		// Reset drag & drop sort state if the switch is disabled only if it is not already enabled in another mode
		if (disableSelector.value && mode !== "link") selected.value = "disabled";
	},
	{ immediate: true }
);

onKeyStroke(
	["Control", "Alt"],
	(e: KeyboardEvent) => {
		if (!disableSelector.value) {
			// Enable 'sort' mode on Ctrl+Alt hold
			if (e.ctrlKey && e.altKey) prefStore.dragAndDropMode = "sort";
			// Enable 'moveToFolder' mode on Ctrl hold
			else if (e.ctrlKey) prefStore.dragAndDropMode = "moveToFolder";
		}
	},
	{ dedupe: true } // Fire event once on hold, instead of at each tick
);

// Disable when key is released
onKeyUp(["Control", "Alt"], () => {
	if (!disableSelector.value) prefStore.dragAndDropMode = "disabled";
});
</script>
