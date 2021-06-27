<template>
	<v-container>
		<v-row>
			<LayoutColumnContent :type="objectTypes.OBJECTIVE" title="Objectifs" :icon="icons.objective"/>
			<LayoutColumnContent :type="objectTypes.EVENT" title="Événements" :icon="icons.event"/>
			<LayoutColumnContent :type="objectTypes.LOCATION" title="Localités" :icon="icons.location"/>
			<LayoutColumnContent :type="objectTypes.CHARACTER" title="Personnages" :icon="icons.character"/>
			<LayoutColumnContent :type="objectTypes.NOTE" title="Notes" :icon="icons.note"/>
		</v-row>
	</v-container>
</template>

<script>
import LayoutColumnContent from "./LayoutColumnContent.vue";

import icons from "../../js/icons.js";
import { eventHub } from "../../js/eventHub.js";
import constants from '../../js/constants';

export default {
	name: "LayoutColumns",
	components: {
		LayoutColumnContent
	},
	data() {
		return {
			icons: icons,
			objectTypes: constants.objectTypes
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

