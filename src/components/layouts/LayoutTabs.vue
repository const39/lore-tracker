<template>
	<v-container>
		<v-tabs fixed-tabs color="accent" v-model="activeTab">
			<v-tab v-for="tab in tabs" :key="tab.name">
				<v-icon left>{{ tab.icon }}</v-icon>
				{{ tab.title }}
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="activeTab">
			<LayoutTabContent :type="objectTypes.OBJECTIVE"/>
			<LayoutTabContent :type="objectTypes.EVENT"/>
			<LayoutTabContent :type="objectTypes.LOCATION"/>
			<LayoutTabContent :type="objectTypes.CHARACTER"/>
			<LayoutTabContent :type="objectTypes.NOTE"/>
		</v-tabs-items>
	</v-container>
</template>

<script>
import LayoutTabContent from "./LayoutTabContent.vue";

import icons from "../../js/icons";
import constants from "../../js/constants";
import { eventHub } from "../../js/eventHub";

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
			objectTypes: constants.objectTypes
		};
	},
	mounted() {
		// Catch TagEvent, show the according tab and scroll to the card with the specified id
		eventHub.$on("tag-selected", (e) => {
			console.log(e);

			switch (e.type) {
				case this.objectTypes.OBJECTIVE:
					this.activeTab = 0;
					break;
				case this.objectTypes.EVENT:
					this.activeTab = 1;
					break;
				case this.objectTypes.LOCATION:
					this.activeTab = 2;
					break;
				case this.objectTypes.CHARACTER:
					this.activeTab = 3;
					break;
				case this.objectTypes.NOTE:
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
