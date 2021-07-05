<template>
	<v-container>
		<v-row>
			<LayoutColumnContent :type="objectTypes.OBJECTIVE" />
			<LayoutColumnContent :type="objectTypes.EVENT" />
			<LayoutColumnContent :type="objectTypes.LOCATION" />
			<LayoutColumnContent :type="objectTypes.CHARACTER" />
			<LayoutColumnContent :type="objectTypes.NOTE" />
		</v-row>
	</v-container>
</template>

<script>
import LayoutColumnContent from "./LayoutColumnContent.vue";

import { eventHub } from "../../js/eventHub.js";
import constants from "../../js/constants";

export default {
	name: "LayoutColumns",
	components: {
		LayoutColumnContent,
	},
	data() {
		return {
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
