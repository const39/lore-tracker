<template>
	<v-container>
		<v-row>
			<LayoutColumnContent :type="objectTypes.OBJECTIVE" :icon="icons.objective" />
			<LayoutColumnContent :type="objectTypes.EVENT" :icon="icons.event" />
			<LayoutColumnContent :type="objectTypes.LOCATION" :icon="icons.location" />
			<LayoutColumnContent :type="objectTypes.CHARACTER" :icon="icons.character" />
			<LayoutColumnContent :type="objectTypes.NOTE" :icon="icons.note" />
		</v-row>
	</v-container>
</template>

<script>
import LayoutColumnContent from "./LayoutColumnContent.vue";

import icons from "../../js/icons.js";
import { eventHub } from "../../js/eventHub.js";
import constants from "../../js/constants";

export default {
	name: "LayoutColumns",
	components: {
		LayoutColumnContent,
	},
	data() {
		return {
			icons: icons,
			objectTypes: constants.objectTypes,
		};
	},
	mounted() {
		// Catch TagEvent and scroll to the card with the specified id
		eventHub.$on("tag-selected", (e) => {
			document.getElementById(e.id + "-card")?.scrollIntoView({ behavior: "smooth" });
		});
	},
	beforeDestroy() {
		eventHub.$off("tag-selected");
	},
};
</script>
