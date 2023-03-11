<template>
	<div>
		<!-- Card ordering selector -->
		<v-item-group class="d-block" mandatory v-model="selectedOrder">
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip top>
					<template v-slot:activator="{ props }">
						<v-btn icon v-bind="props" :color="isSelected ? 'primary' : ''" @click="toggle">
							<v-icon v-if="isSelected">mdi-sort-clock-descending</v-icon>
							<v-icon v-else>mdi-sort-clock-descending-outline</v-icon>
						</v-btn>
					</template>
					{{ $t("status.selectors.customOrder") }}
				</v-tooltip>
			</v-item>
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip top>
					<template v-slot:activator="{ props }">
						<v-btn icon v-bind="props" :color="isSelected ? 'primary' : ''" @click="toggle">
							<v-icon>mdi-sort-alphabetical-variant</v-icon>
						</v-btn>
					</template>
					{{ $t("status.selectors.alphanumericOrder") }}
				</v-tooltip>
			</v-item>
		</v-item-group>
		<!-- Layout selector -->
		<v-item-group class="d-block" mandatory v-model="selectedLayout">
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip bottom>
					<template v-slot:activator="{ props }">
						<v-btn icon v-bind="props" :color="isSelected ? 'accent' : ''" @click="toggle">
							<v-icon>mdi-tab</v-icon>
						</v-btn>
					</template>
					{{ $t("status.selectors.tabLayout") }}
				</v-tooltip>
			</v-item>
			<v-item v-slot="{ isSelected, toggle }">
				<v-tooltip bottom>
					<template v-slot:activator="{ props }">
						<v-btn icon v-bind="props" :color="isSelected ? 'accent' : ''" @click="toggle">
							<v-icon>mdi-view-column-outline</v-icon>
						</v-btn>
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
