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
				color="secondary"
				variant="outlined"
				divided
				mandatory
			>
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn v-bind="props" :value="modes[0]" size="small" icon="mdi-cancel" />
					</template>
					{{ $t(`dragAndDrop.modes.${modes[0]}`) }}
				</v-tooltip>
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn v-bind="props" :value="modes[1]" size="small" icon="mdi-sort" />
					</template>
					{{ $t(`dragAndDrop.modes.${modes[1]}`) }}
				</v-tooltip>
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="modes[2]"
							size="small"
							icon="mdi-link-variant"
							disabled
						/>
					</template>
					{{ $t(`dragAndDrop.modes.${modes[2]}`) }}
				</v-tooltip>
			</v-btn-toggle>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { t as $t } from "@/core/translation";
import { useFilterStore } from "@/store/filter";
import { usePreferencesStore, type DragAndDropMode } from "@/store/preferences";

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();

const modes: DragAndDropMode[] = ["disabled", "sort", "link"];

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
</script>
