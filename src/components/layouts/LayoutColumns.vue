<template>
	<v-container>
		<v-row>
			<LayoutColumnContent v-for="cat in categories" :key="cat" :category="cat" />
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import LayoutColumnContent from "./LayoutColumnContent.vue";

import { useEventHub, TagEvent } from "@/js/eventHub";
import { CardCategory as categories } from "@/js/types";

const eventHub = useEventHub();

onMounted(() => {
	// Catch TagEvent and scroll to the card with the specified id
	eventHub.on(TagEvent.ID, (e: TagEvent) => {
		document.getElementById(e.tag.id + "-card")?.scrollIntoView({ behavior: "smooth" });
	});
});

onBeforeUnmount(() => {
	eventHub.off(TagEvent.ID);
});
</script>
