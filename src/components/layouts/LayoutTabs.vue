<template>
	<v-container>
		<v-tabs fixed-tabs v-model="activeTab">
			<v-tab v-for="tab in tabs" :key="tab.name">
				<v-icon left>{{ tab.icon }}</v-icon>
				{{ tab.title }}
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="activeTab">
			<LayoutTabContent v-model="liveData.objectives" type="objective"/>
			<LayoutTabContent v-model="liveData.events" type="event"/>
			<LayoutTabContent v-model="liveData.locations" type="location"/>
			<LayoutTabContent v-model="liveData.characters" type="character"/>
			<LayoutTabContent v-model="liveData.notes" type="note"/>
		</v-tabs-items>
	</v-container>
</template>

<script>
import LayoutTabContent from "./LayoutTabContent.vue";

import storage from "../../js/storage.js";
import icons from "../../js/icons";

export default {
	name: "LayoutTabs",
	components: {
		LayoutTabContent,
	},
	data() {
		return {
			tabs: [
				{
					title: "Objectifs",
					icon: icons.objective,
				},
				{
					title: "Événements",
					icon: icons.event,
				},
				{
					title: "Localités",
					icon: icons.location,
				},
				{
					title: "Personnages",
					icon: icons.character,
				},
				{
					title: "Notes",
					icon: icons.note,
				},
			],

			activeTab: "",
			liveData: storage.data,
		};
	},
};
</script>
