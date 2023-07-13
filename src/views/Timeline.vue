<template>
	<div class="my-3">
		<div class="d-flex">
			<div class="text-xl-h4">
				{{ $t("pages.timeline") }}
			</div>
			<!-- Events order selector -->
			<v-btn-toggle
				v-model="sortOrder"
				class="mx-4 d-flex justify-center"
				color="primary"
				variant="plain"
				mandatory
			>
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="orderValues[0]"
							:icon="getIcon('mdi-sort-clock-ascending', orderValues[0])"
							class="full-opacity"
							rounded="xl"
						/>
					</template>
					{{ $t("timeline.ascOrder") }}
				</v-tooltip>
				<v-tooltip location="top">
					<template #activator="{ props }">
						<v-btn
							v-bind="props"
							:value="orderValues[1]"
							:icon="getIcon('mdi-sort-clock-descending', orderValues[1])"
							class="full-opacity"
							rounded="xl"
						/>
					</template>
					{{ $t("timeline.descOrder") }}
				</v-tooltip>
			</v-btn-toggle>
		</div>
		<v-timeline
			v-if="nodes.length > 0"
			:truncate-line="sortOrder === 'asc' ? 'start' : 'end'"
			class="mx-16 my-6"
			direction="vertical"
			density="compact"
			align="start"
		>
			<!-- Place events before pivot node in descending order -->
			<template v-if="sortOrder === 'desc'">
				<TimelineEvent v-for="node in sortedNodes" :key="getKey(node)" :item="node" />
			</template>
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
			<!-- Place events after pivot node in ascending order -->
			<template v-if="sortOrder === 'asc'">
				<TimelineEvent v-for="node in sortedNodes" :key="getKey(node)" :item="node" />
			</template>
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
import { computed } from "vue";
import { ref } from "vue";
import TimelineEvent from "@/components/timeline/TimelineEvent.vue";
import { CardCategory, Event } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import { useCardsStore } from "@/store/cards";

interface GroupByDayMapping {
	[key: number]: Event[];
}

type Order = "asc" | "desc";
const orderValues: Order[] = ["asc", "desc"];
const sortOrder = ref<Order>("asc");

const cardsStore = useCardsStore();

function getIcon(baseIcon: string, order: Order) {
	return sortOrder.value === order ? baseIcon : baseIcon + "-outline";
}

function getKey(node: Event | string) {
	return typeof node === "object" ? node.id : node;
}

const nodes = computed(() => {
	// Get events from store and reverse it to obtain events in chronological order
	const events = cardsStore.getAllFiles(CardCategory.Event).reverse();

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

const sortedNodes = computed(() =>
	sortOrder.value === "asc" ? nodes.value : [...nodes.value].reverse()
);
</script>
