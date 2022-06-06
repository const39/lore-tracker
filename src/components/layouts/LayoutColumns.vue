<template>
	<v-container>
		<v-row>
			<LayoutColumnContent v-for="cat in categories" :key="cat" :category="cat" />
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LayoutColumnContent from "./LayoutColumnContent.vue";

import { eventHub, TagEvent } from "@/js/eventHub";
import { CardCategory } from "@/js/types";

export default Vue.extend({
	name: "LayoutColumns",
	components: {
		LayoutColumnContent,
	},
	data() {
		return {
			categories: CardCategory,
		};
	},
	mounted() {
		// Catch TagEvent and scroll to the card with the specified id
		eventHub.$on("tag-selected", (e: TagEvent) => {
			document.getElementById(e.tag.id + "-card")?.scrollIntoView({ behavior: "smooth" });
		});
	},
	beforeDestroy() {
		eventHub.$off("tag-selected");
	},
});
</script>
