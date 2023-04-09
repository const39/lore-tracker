<template>
	<v-row>
		<LayoutColumnContent v-for="cat in categories" :key="cat" :category="cat" />
	</v-row>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import LayoutColumnContent from "./LayoutColumnContent.vue";

import { eventBus } from "@/js/eventBus";
import { CardCategory as categories } from "@/js/types";

onMounted(() => {
	// Catch TagEvent and scroll to the card with the specified id
	eventBus.on("select-tag", (tag) => {
		document.getElementById(tag.id + "-card")?.scrollIntoView({ behavior: "smooth" });
	});
});

onBeforeUnmount(() => {
	eventBus.off("select-tag");
});
</script>
