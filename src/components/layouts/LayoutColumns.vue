<template>
	<v-container>
		<v-row>
			<LayoutColumnContent v-model="liveData.objectives" type="objective" title="Objectifs" :icon="icons.objective"/>
			<LayoutColumnContent v-model="liveData.events" type="event" title="Événements" :icon="icons.event"/>
			<LayoutColumnContent v-model="liveData.locations" type="location" title="Localités" :icon="icons.location"/>
			<LayoutColumnContent v-model="liveData.characters" type="character" title="Personnages" :icon="icons.character"/>
			<LayoutColumnContent v-model="liveData.notes" type="note" title="Notes" :icon="icons.note"/>
		</v-row>
	</v-container>
</template>

<script>
import LayoutColumnContent from "./LayoutColumnContent.vue";

import storage from "../../js/storage.js";
import icons from "../../js/icons.js";

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
			liveData: storage.data,
			icons: icons,
		};
	},
};
</script>

