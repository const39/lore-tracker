<template>
	<div>
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
import { t as $t } from "@/core/translation";
import { Density, Order, usePreferencesStore } from "@/store/preferences";

const prefStore = usePreferencesStore();

const orderValues: Order[] = ["default", "alphanumeric"];
const densityValues: Density[] = ["large", "comfortable", "compact"];
</script>

<style scoped>
.full-opacity {
	opacity: 1;
}
</style>
