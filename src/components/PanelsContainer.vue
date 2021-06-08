<template>
	<div>
		<div class="my-3">
			<div class="text-xl-h4 text-center">Lore tracker</div>
			<v-spacer></v-spacer>
			<div class="display-selector">
				<v-btn icon :color="color('consecutive')" @click="onClick('consecutive')">
					<v-icon>mdi-view-list-outline</v-icon>
				</v-btn>
				<v-btn icon :color="color('tabbed')" @click="onClick('tabbed')">
					<v-icon>mdi-tab</v-icon>
				</v-btn>
				<v-btn icon :color="color('column')" @click="onClick('column')">
					<v-icon>mdi-view-column-outline</v-icon>
				</v-btn>
			</div>
		</div>

		<ConsecutivePanels v-if="selectedDisplay == 'consecutive'"></ConsecutivePanels>
		<TabbedPanels v-else-if="selectedDisplay == 'tabbed'"></TabbedPanels>
		<ColumnPanels v-else-if="selectedDisplay == 'column'"></ColumnPanels>
	</div>
</template>

<script>
import ConsecutivePanels from "./ConsecutivePanels.vue";
import TabbedPanels from "./TabbedPanels.vue";
import ColumnPanels from "./ColumnPanels.vue";

export default {
	name: "PanelsContainer",
	components: {
		ConsecutivePanels,
		TabbedPanels,
		ColumnPanels,
	},
	data() {
		return {
			selectedDisplay: "consecutive",
		};
	},
	methods: {
		onClick(name) {
			this.selectedDisplay = name;
		},
		color(name) {
			return this.selectedDisplay == name ? "primary" : "grey";
		},
	},
};
</script>

<style></style>
