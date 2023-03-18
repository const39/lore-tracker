<template>
	<div>
		<!-- Card ordering selector -->
		<v-item-group class="d-block" mandatory v-model="selectedOrder">
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip location="top">
					<template v-slot:activator="{ props }">
						<v-btn
							v-bind="props"
							variant="text"
							:icon="'mdi-sort-clock-descending' + (isSelected ? '' : '-outline')"
							:color="isSelected ? 'primary' : ''"
							@click="toggle"
						></v-btn>
					</template>
					{{ $t("status.selectors.customOrder") }}
				</v-tooltip>
			</v-item>
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip location="top">
					<template v-slot:activator="{ props }">
						<v-btn
							v-bind="props"
							variant="text"
							icon="mdi-sort-alphabetical-variant"
							:color="isSelected ? 'primary' : ''"
							@click="toggle"
						></v-btn>
					</template>
					{{ $t("status.selectors.alphanumericOrder") }}
				</v-tooltip>
			</v-item>
		</v-item-group>
		<!-- Layout selector -->
		<v-item-group class="d-block" mandatory v-model="selectedLayout">
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip location="bottom">
					<template v-slot:activator="{ props }">
						<v-btn
							v-bind="props"
							variant="text"
							icon="mdi-tab"
							:color="isSelected ? 'accent' : ''"
							@click="toggle"
						></v-btn>
					</template>
					{{ $t("status.selectors.tabLayout") }}
				</v-tooltip>
			</v-item>
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip location="bottom">
					<template v-slot:activator="{ props }">
						<v-btn
							v-bind="props"
							variant="text"
							icon="mdi-view-column-outline"
							:color="isSelected ? 'accent' : ''"
							@click="toggle"
						></v-btn>
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
const selectedOrder = ref(0);
const selectedLayout = ref(0);

const emit = defineEmits<{
	(e: "order", value: number): void;
	(e: "layout", value: number): void;
}>();

watch(selectedOrder, (value) => emit("order", value));
watch(selectedLayout, (value) => emit("layout", value));
</script>
