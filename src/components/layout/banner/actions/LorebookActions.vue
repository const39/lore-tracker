<template>
	<div>
		<div class="d-flex">
			<!-- Card ordering selector -->
			<v-btn-toggle
				v-model="prefStore.cardsOrder"
				class="d-flex justify-center"
				color="primary"
				variant="plain"
				mandatory
			>
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="orderValues[0]"
							class="full-opacity"
							rounded="xl"
							icon="mdi-sort-clock-descending"
						/>
					</template>
					{{ $t("status.selectors.customOrder") }}
				</v-tooltip>
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="orderValues[1]"
							class="full-opacity"
							rounded="xl"
							icon="mdi-sort-alphabetical-variant"
						/>
					</template>
					{{ $t("status.selectors.alphanumericOrder") }}
				</v-tooltip>
			</v-btn-toggle>
			<v-divider class="mx-1 my-2" vertical />
			<!-- Card drag & drop sort toggle -->
			<v-tooltip location="top">
				<template #activator="{ props }">
					<OnOffBtn
						v-model="dragAndDropSortState"
						v-bind="props"
						:disabled="disableSwitch"
						:class="{ 'full-opacity': !disableSwitch }"
						variant="plain"
						on-icon="mdi-lock-open-variant"
						off-icon="mdi-lock"
					/>
				</template>
				{{ $t("status.selectors.cardDragAndDrop") }}
			</v-tooltip>
		</div>
		<!-- Density selector -->
		<v-btn-toggle v-model="prefStore.cardsDensity" color="accent" variant="plain" mandatory>
			<v-tooltip location="bottom">
				<template #activator="{ props }">
					<v-btn
						v-bind="props"
						:value="densityValues[0]"
						class="full-opacity"
						rounded="xl"
						icon="mdi-view-grid"
					/>
				</template>
				{{ $t("status.selectors.largeTabDensity") }}
			</v-tooltip>
			<v-tooltip location="bottom">
				<template #activator="{ props }">
					<v-btn
						v-bind="props"
						:value="densityValues[1]"
						class="full-opacity"
						rounded="xl"
						icon="mdi-view-comfy"
					/>
				</template>
				{{ $t("status.selectors.comfortableTabDensity") }}
			</v-tooltip>
			<v-tooltip location="bottom">
				<template #activator="{ props }">
					<v-btn
						v-bind="props"
						:value="densityValues[2]"
						class="full-opacity"
						rounded="xl"
						icon="mdi-view-module"
					/>
				</template>
				{{ $t("status.selectors.compactTabDensity") }}
			</v-tooltip>
		</v-btn-toggle>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import OnOffBtn from "@/components/common/OnOffBtn.vue";
import { t as $t } from "@/core/translation";
import { useFilterStore } from "@/store/filter";
import { Density, Order, usePreferencesStore } from "@/store/preferences";

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();

const orderValues: Order[] = ["default", "alphanumeric"];
const densityValues: Density[] = ["large", "comfortable", "compact"];

const disableSwitch = ref(true);

// Boolean computed property indicating if drag and drop is in 'sort' mode
const dragAndDropSortState = computed({
	get() {
		return prefStore.dragAndDropMode === "sort";
	},
	set(value) {
		prefStore.dragAndDropMode = value ? "sort" : "disabled";
	},
});

watch(
	[() => prefStore.cardsOrder, () => filterStore.isFilterActive, () => prefStore.dragAndDropMode],
	([order, filter, mode]) => {
		// Disable drag and drop 'sort' mode switch if:
		// - Cards are sorted automatically (i.e. not in custom order)
		// - A search filter is active
		// - Drag&drop is not already enabled in another mode
		disableSwitch.value = order === "alphanumeric" || !!filter || mode === "drop";

		// Reset drag & drop sort state if the switch is disabled only if it is not already enabled in another mode
		if (disableSwitch.value && mode !== "drop") dragAndDropSortState.value = false;
	},
	{ immediate: true }
);
</script>

<style scoped>
.full-opacity {
	opacity: 1;
}
</style>
