<template>
	<div>
		<!-- Card ordering selector -->
		<v-item-group v-model="selectedOrder" class="d-block" mandatory>
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:icon="'mdi-sort-clock-descending' + (isSelected ? '' : '-outline')"
							:color="isSelected ? 'primary' : ''"
							variant="text"
							@click="toggle"
						/>
					</template>
					{{ $t("status.selectors.customOrder") }}
				</v-tooltip>
			</v-item>
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:color="isSelected ? 'primary' : ''"
							variant="text"
							icon="mdi-sort-alphabetical-variant"
							@click="toggle"
						/>
					</template>
					{{ $t("status.selectors.alphanumericOrder") }}
				</v-tooltip>
			</v-item>
		</v-item-group>
		<!-- Layout selector -->
		<v-item-group v-model="selectedLayout" class="d-block" mandatory>
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:color="isSelected ? 'accent' : ''"
							variant="text"
							icon="mdi-tab"
							@click="toggle"
						/>
					</template>
					{{ $t("status.selectors.tabLayout") }}
				</v-tooltip>
			</v-item>
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip location="bottom">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:color="isSelected ? 'accent' : ''"
							variant="text"
							icon="mdi-view-column-outline"
							@click="toggle"
						/>
					</template>
					{{ $t("status.selectors.columnLayout") }}
				</v-tooltip>
			</v-item>
		</v-item-group>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { t as $t } from "@/js/translation";
const emit = defineEmits<{
	(e: "order", value: number): void;
	(e: "layout", value: number): void;
}>();
const selectedOrder = ref(0);
const selectedLayout = ref(0);

watch(selectedOrder, (value) => emit("order", value));
watch(selectedLayout, (value) => emit("layout", value));
</script>
