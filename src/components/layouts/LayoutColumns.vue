<template>
	<v-container>
		<v-row>
			<LayoutColumnContent type="objective" title="Objectifs" :icon="icons.objective"/>
			<LayoutColumnContent type="event" title="Événements" :icon="icons.event"/>
			<LayoutColumnContent type="location" title="Localités" :icon="icons.location"/>
			<LayoutColumnContent type="character" title="Personnages" :icon="icons.character"/>
			<LayoutColumnContent type="note" title="Notes" :icon="icons.note"/>
		</v-row>
	</v-container>
</template>

<script>
import LayoutColumnContent from "./LayoutColumnContent.vue";

import icons from "../../js/icons.js";
import { eventHub } from "../../js/eventHub.js";

export default {
	name: "LayoutColumns",
	components: {
		LayoutColumnContent
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

