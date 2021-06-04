<template>
	<div>
		<v-row>
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
		</v-row>

		<ConsecutivePanels v-if="selectedDisplay == 'consecutive'"></ConsecutivePanels>
		<div v-else-if="selectedDisplay == 'tabbed'"></div>
		<div v-else-if="selectedDisplay == 'column'"></div>
	</div>
</template>

<script>
import ConsecutivePanels from "./ConsecutivePanels.vue";

export default {
	name: "PanelsContainer",
	components: {
		ConsecutivePanels,
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
