<template>
	<v-container>
		<v-expansion-panels multiple>
			<Panel :title="panels[0]"> </Panel>
			<Panel :title="panels[1]"> </Panel>
			<Panel :title="panels[2]">
				<LocationCard v-for="location in data.locations" :key="location.id" v-bind="location"></LocationCard>
				<LocationForm></LocationForm>
			</Panel>
			<Panel :title="panels[3]"> </Panel>
			<Panel :title="panels[4]"> </Panel>
		</v-expansion-panels>
	</v-container>
</template>

<script>
import Panel from "./Panel.vue";
import LocationCard from "./cards/LocationCard.vue";
import LocationForm from "./forms/LocationForm.vue";

import storage from "../js/storage.js";

export default {
	name: "ConsecutivePanels",
	components: {
		Panel,
		LocationCard,
		LocationForm,
	},
	data() {
		return {
			panels: ["Objectifs", "Événements", "Localités", "Personnages", "Notes"],
			data: storage.testData,
		};
	},
};
</script>

<style></style>
