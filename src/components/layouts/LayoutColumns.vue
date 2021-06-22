<template>
	<v-container>
		<v-row>
			<LayoutColumnContent v-model="items.objectives" type="objective" title="Objectifs" :icon="icons.objective"/>
			<LayoutColumnContent v-model="items.events" type="event" title="Événements" :icon="icons.event"/>
			<LayoutColumnContent v-model="items.locations" type="location" title="Localités" :icon="icons.location"/>
			<LayoutColumnContent v-model="items.characters" type="character" title="Personnages" :icon="icons.character"/>
			<LayoutColumnContent v-model="items.notes" type="note" title="Notes" :icon="icons.note"/>
		</v-row>
	</v-container>
</template>

<script>
import LayoutColumnContent from "./LayoutColumnContent.vue";

import storage from "../../js/storage.js";
import icons from "../../js/icons.js";

import { eventHub } from "../../js/eventHub.js";

export default {
	name: "LayoutColumns",
	components: {
		LayoutColumnContent
	},
	props: {
		items: storage.schema
	},
	data() {
		return {
			panels: [
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
			// liveData: storage.data,
			icons: icons,
		};
	},
	mounted() {
		// Catch TagEvent and scroll to the card with the specified id
		eventHub.$on("tag-selected", (e) => {
			document.getElementById(e.id + '-card')?.scrollIntoView({behavior: 'smooth'});
		});
	},
	beforeDestroy() {
		eventHub.$off("tag-selected");
	},
};
</script>

