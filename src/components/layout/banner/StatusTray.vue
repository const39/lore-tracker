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
					{{ $t("data.campaign.day") + " " + daysCounter }}
				</span>
				|
				<span
					class="clickable"
					@click.left="nextSeason()"
					@click.prevent.right="previousSeason()"
				>
					<v-icon :color="seasonColors[currentSeason]" size="small" icon="mdi-flower" />
					{{ $t(`data.campaign.seasons.${currentSeason}`) }}
				</span>
			</div>
		</template>
		{{ $t("pages.loreBook.banner.statusAction") }}
	</v-tooltip>
</template>

<script lang="ts" setup>
import { useCycleList } from "@vueuse/core";
import { computed, watch } from "vue";
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

const dayValidator = validationRules.numberInRange("", 1);

const daysCounter = computed({
	get() {
		return props.day;
	},
	set(val) {
		// Update v-model:day if the validation passed
		if (dayValidator(val) === true) emit("update:day", val);
	},
});

const {
	state: currentSeason,
	next: nextSeason,
	prev: previousSeason,
} = useCycleList(Object.values(Season), { initialValue: computed(() => props.season) });

// Update v-model:season on value change
watch(currentSeason, (season) => emit("update:season", season));

// * Style
const seasonColors = {
	[Season.SPRING]: "green-darken-1",
	[Season.SUMMER]: "yellow-darken-2",
	[Season.AUTUMN]: "deep-orange-darken-2",
	[Season.WINTER]: "blue-grey-darken-1",
} as const;
</script>
