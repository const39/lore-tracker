<template>
	<v-tooltip location="bottom">
		<template #activator="{ props }">
			<div class="d-inline text-body-2" v-bind="props">
				<span class="clickable" @click.left="daysCounter++" @click.right="daysCounter--">
					<v-icon size="small" icon="mdi-white-balance-sunny" />
					{{ $t("status.day") + daysCounter }}
				</span>
				|
				<span class="clickable" @click.left="nextSeason" @click.right="previousSeason">
					<v-icon size="small" icon="mdi-flower" />
					{{ currentSeason }}
				</span>
			</div>
		</template>
		{{ $t("status.action") }}
	</v-tooltip>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { t as $t } from "@/js/translation";
import { Season } from "@/js/types";
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
		return $t(`status.seasons.${campaignInfoStore.season}`);
	},
	set(val) {
		campaignInfoStore.season = val as Season;
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
</script>
