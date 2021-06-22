<template>
	<v-container>
		<v-tabs fixed-tabs v-model="activeTab">
			<v-tab v-for="tab in tabs" :key="tab.name">
				<v-icon left>{{ tab.icon }}</v-icon>
				{{ tab.title }}
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="activeTab">
			<LayoutTabContent v-model="items.objectives" type="objective"/>
			<LayoutTabContent v-model="items.events" type="event"/>
			<LayoutTabContent v-model="items.locations" type="location"/>
			<LayoutTabContent v-model="items.characters" type="character"/>
			<LayoutTabContent v-model="items.notes" type="note"/>
		</v-tabs-items>
	</v-container>
</template>

<script>
import LayoutTabContent from "./LayoutTabContent.vue";

import storage from "../../js/storage.js";
import icons from "../../js/icons";
import { eventHub } from "../../js/eventHub";

export default {
	name: "LayoutTabs",
	components: {
		LayoutTabContent,
	},
	props: {
		items: storage.schema
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
			// liveData: storage.data,
		};
	},
	mounted() {
		// Catch TagEvent, show the according tab and scroll to the card with the specified id
		eventHub.$on("tag-selected", (e) => {

			switch (e.type.toLowerCase()) {
				case "objective":
					this.activeTab = 0;
					break;
				case "event":
					this.activeTab = 1;
					break;
				case "location":
					this.activeTab = 2;
					break;
				case "character":
					this.activeTab = 3;
					break;
				case "note":
					this.activeTab = 4;
					break;
			}
			document.getElementById(e.id + '-card')?.scrollIntoView({behavior: 'smooth'});
		});
	},
	beforeDestroy() {
		eventHub.$off("tag-selected");
	},
};
</script>
