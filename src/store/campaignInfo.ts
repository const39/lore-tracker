import { Season, SerializedState } from "@/js/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface CampaignInfoState {
	name: string;
	days: number;
	season: Season;
}

function getDefaults(): CampaignInfoState {
	return {
		name: "Campaign",
		days: 0,
		season: Season.SPRING,
	};
}

export const useCampaignInfoStore = defineStore("campaignInfo", () => {
	const _defaults = getDefaults();

	const name = ref(_defaults.name);
	const days = ref(_defaults.days);
	const season = ref(_defaults.season);

	const serializableState = computed(() => ({ name, days, season }));

	function $reset() {
		$hydrate(getDefaults());
	}

	function $hydrate(payload: SerializedState | CampaignInfoState) {
		name.value = payload.name;
		days.value = payload.days;
		season.value = payload.season;
	}

	return { name, days, season, serializableState, $reset, $hydrate };
});
