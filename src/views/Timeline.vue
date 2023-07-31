<template>
	<div v-if="campaign" class="my-3">
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
					<template #activator="{ props: tooltipProps }">
						<v-btn
							v-bind="tooltipProps"
							:value="orderValues[0]"
							:icon="getIcon('mdi-sort-clock-ascending', orderValues[0])"
							class="full-opacity"
							rounded="xl"
						/>
					</template>
					{{ $t("timeline.ascOrder") }}
				</v-tooltip>
				<v-tooltip location="top">
					<template #activator="{ props: tooltipProps }">
						<v-btn
							v-bind="tooltipProps"
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
			<router-link :to="{ name: 'LoreBookRoot' }">
				{{ $t("pages.loreBook") }}
			</router-link>.
		</p>
	</div>
	<!-- Display alert in case campaign does not exist -->
	<v-alert
		v-else
		:title="$t('messages.errors.campaign.campaignNotFound.title')"
		type="error"
		variant="tonal"
	>
		<router-link :to="{ name: 'Campaigns' }">
			{{ $t("messages.errors.campaign.campaignNotFound.action") }}
		</router-link>
	</v-alert>
</template>
<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed, ref } from "vue";
import TimelineEvent from "@/components/timeline/TimelineEvent.vue";
import { Event } from "@/core/models";
import { CampaignRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";

const props = defineProps<{ campaignId: UUID }>();

type Order = "asc" | "desc";
const orderValues: Order[] = ["asc", "desc"];
const sortOrder = ref<Order>("asc");

const eventRepo = useRepo(Event);

const campaign = computed(() => useRepo(CampaignRepo).getCampaign(props.campaignId));

const nodes = computed(() => {
	// Get events from store and group them by day
	const groupedByDay = eventRepo.where("campaignId", props.campaignId).groupBy("day").get();

	// Build final array of nodes by joining each indexed array and adding header nodes between them
	// We then obtain the full nodes array with events sorted in chronological order
	let nodes: Array<Event | string> = [];
	for (const index in groupedByDay) {
		// Push a header for the current day
		nodes.push(`${$t("campaign.state.day")} ${index}`);

		// Add all events that happened this day, keeping the order defined by the user
		nodes = nodes.concat(groupedByDay[index]);
	}

	return nodes;
});

const sortedNodes = computed(() =>
	sortOrder.value === "asc" ? nodes.value : [...nodes.value].reverse()
);

function getIcon(baseIcon: string, order: Order) {
	return sortOrder.value === order ? baseIcon : baseIcon + "-outline";
}

function getKey(node: Event | string) {
	return typeof node === "object" ? node.id : node;
}
</script>
