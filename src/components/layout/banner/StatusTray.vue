<template>
	<v-tooltip location="bottom">
		<template #activator="{ props }">
			<div class="d-inline text-body-2" v-bind="props">
				<span
					class="clickable"
					@click.left="daysCounter++"
					@click.prevent.right="daysCounter--"
				>
					<v-icon color="yellow-darken-2" size="small" icon="mdi-white-balance-sunny" />
					{{ $t("status.day") + daysCounter }}
				</span>
				|
				<span
					class="clickable"
					@click.left="nextSeason"
					@click.prevent.right="previousSeason"
				>
					<v-icon :color="seasonColors[currentSeason]" size="small" icon="mdi-flower" />
					{{ $t(`status.seasons.${currentSeason}`) }}
				</span>
			</div>
		</template>
		{{ $t("status.action") }}
	</v-tooltip>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Season } from "@/core/constants";
import { t as $t } from "@/core/translation";
import { useCampaignInfoStore } from "@/store/campaignInfo";

const campaignInfoStore = useCampaignInfoStore();

const daysCounter = computed({
	get() {
		return campaignInfoStore.days;
	},
	set(val) {
		if (Number.isSafeInteger(val) && val > -1) campaignInfoStore.days = val;
	},
});

const currentSeason = computed({
	get() {
		return campaignInfoStore.season;
	},
	set(val) {
		campaignInfoStore.season = val;
	},
});

function previousSeason() {
	const values = Object.values(Season);
	const index = values.findIndex((entry) => entry === campaignInfoStore.season);
	if (index > -1) {
		if (index > 0) currentSeason.value = values[index - 1];
		else currentSeason.value = values[values.length - 1];
	}
}
function nextSeason() {
	const values = Object.values(Season);
	const index = values.findIndex((entry) => entry === campaignInfoStore.season);
	if (index > -1) {
		if (index < values.length - 1) currentSeason.value = values[index + 1];
		else currentSeason.value = values[0];
	}
}

// * Style
const seasonColors = {
	[Season.SPRING]: "green-darken-1",
	[Season.SUMMER]: "yellow-darken-2",
	[Season.AUTUMN]: "deep-orange-darken-2",
	[Season.WINTER]: "blue-grey-darken-1",
} as const;
</script>
