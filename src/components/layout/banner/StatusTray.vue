<template>
	<v-tooltip location="bottom">
		<template #activator="{ props: tooltipProps }">
			<div class="d-inline text-body-2" v-bind="tooltipProps">
				<span
					class="clickable"
					@click.left="daysCounter++"
					@click.prevent.right="daysCounter--"
				>
					<v-icon color="yellow-darken-2" size="small" icon="mdi-white-balance-sunny" />
					{{ $t("campaign.state.day") + " " + daysCounter }}
				</span>
				|
				<span
					class="clickable"
					@click.left="nextSeason"
					@click.prevent.right="previousSeason"
				>
					<v-icon :color="seasonColors[currentSeason]" size="small" icon="mdi-flower" />
					{{ $t(`campaign.state.seasons.${currentSeason}`) }}
				</span>
			</div>
		</template>
		{{ $t("status.action") }}
	</v-tooltip>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Season } from "@/core/models";
import { t as $t } from "@/core/translation";
import validationRules from "@/core/validationRules";

const props = defineProps<{
	day: number; // v-model:day
	season: Season; // v-model:season
}>();

const emit = defineEmits<{
	(e: "update:day", value: number): void;
	(e: "update:season", value: Season): void;
}>();

const seasons = Object.values(Season);
const dayValidator = validationRules.numberInRange("", 1);

const daysCounter = computed({
	get() {
		return props.day;
	},
	set(val) {
		if (dayValidator(val) === true) emit("update:day", val);
	},
});

const currentSeason = computed({
	get() {
		return props.season;
	},
	set(val) {
		emit("update:season", val);
	},
});

function previousSeason() {
	const index = seasons.findIndex((entry) => entry === currentSeason.value);
	if (index > -1) {
		if (index > 0) currentSeason.value = seasons[index - 1];
		else currentSeason.value = seasons[seasons.length - 1];
	}
}
function nextSeason() {
	const index = seasons.findIndex((entry) => entry === currentSeason.value);
	if (index > -1) {
		if (index < seasons.length - 1) currentSeason.value = seasons[index + 1];
		else currentSeason.value = seasons[0];
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
