<template>
	<v-container>
		<div class="my-3">
			<div class="text-xl-h4">{{ $t("pages.timeline") }}</div>
			<v-timeline dense class="mx-16 my-6" v-if="nodes.length > 0">
				<v-timeline-item icon="mdi-star" color="yellow darken-1" class="d-flex align-center" fill-dot>
					<div class="text--primary font-weight-medium">{{ $t("timeline.campaignStart") }}</div>
				</v-timeline-item>
				<TimelineEvent v-for="node in nodes" :key="node.id || node" :item="node" />
			</v-timeline>
			<p class="text-center" v-else>
				{{ $t("timeline.noEvent") }}
				<router-link :to="{name: 'Home'}">{{ $t("pages.home") }}</router-link
				>.
			</p>
		</div>
	</v-container>
</template>
<script>
import TimelineEvent from "../components/TimelineEvent.vue";

export default {
	components: {
		TimelineEvent,
	},
	computed: {
		nodes() {
			// Get events from store, create a copy of the array and reverse it to obtain events in chronological order
			let events = this.$store.state.cards.events.slice().reverse();

			// Browse through events to index them by their day field
			let indexedByDay = {};
			for (const event of events) {
				const index = event.day;

				// Create array for this index if it doesn't exist yet
				if (!Array.isArray(indexedByDay[index])) indexedByDay[index] = [];

				indexedByDay[index].push(event);
			}

			// Build final array of nodes by joining each indexed array and adding header nodes between them
			// We then obtain the full nodes array with events sorted in chronological order
			let nodes = [];
			for (const index in indexedByDay) {
				// Push a header for the current day
				nodes.push(`${this.$t("status.day")} ${index}`);

				// Add all events that happened this day, keeping the order defined by the user
				nodes = nodes.concat(indexedByDay[index]);
			}

			return nodes;
		},
	},
};
</script>
