<template>
	<div class="my-3">
		<div class="text-xl-h4">
			{{ $t("pages.timeline") }}
		</div>
		<v-timeline
			v-if="nodes.length > 0"
			class="mx-16 my-6"
			direction="vertical"
			density="compact"
		>
			<v-timeline-item
				icon="mdi-star"
				dot-color="yellow-darken-1"
				icon-color="white"
				fill-dot
			>
				<div class="font-weight-medium">
					{{ $t("timeline.campaignStart") }}
				</div>
			</v-timeline-item>
			<TimelineEvent v-for="node in nodes" :key="getKey(node)" :item="node" />
		</v-timeline>
		<p v-else class="text-center">
			{{ $t("timeline.noEvent") }}
			<router-link :to="{ name: 'LoreBook' }">
				{{ $t("pages.loreBook") }}
			</router-link>.
		</p>
	</div>
</template>
<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { Event } from "@/js/types";
import { useCardsStore } from "@/store/cards";
import { computed } from "vue";
import TimelineEvent from "../components/TimelineEvent.vue";

const cardsStore = useCardsStore();

interface GroupByDayMapping {
	[key: number]: Event[];
}

function getKey(node: Event | string) {
	return typeof node === "object" ? node.id : node;
}

const nodes = computed(() => {
	// Get events from store, create a copy of the array and reverse it to obtain events in chronological order
	const events = cardsStore.cards.event.slice().reverse();

	// Browse through events to index them by their day field
	const indexedByDay: GroupByDayMapping = {};
	for (const event of events) {
		const index = event.day;

		// Create array for this index if it doesn't exist yet
		if (!Array.isArray(indexedByDay[index])) indexedByDay[index] = [];

		indexedByDay[index].push(event);
	}

	// Build final array of nodes by joining each indexed array and adding header nodes between them
	// We then obtain the full nodes array with events sorted in chronological order
	let nodes: Array<Event | string> = [];
	for (const index in indexedByDay) {
		// Push a header for the current day
		nodes.push(`${$t("status.day")} ${index}`);

		// Add all events that happened this day, keeping the order defined by the user
		nodes = nodes.concat(indexedByDay[index]);
	}

	return nodes;
});
</script>
