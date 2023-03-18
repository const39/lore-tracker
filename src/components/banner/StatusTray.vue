<template>
	<v-tooltip location="bottom">
		<template v-slot:activator="{ props }">
			<div class="d-inline text-body-2" v-bind="props">
				<span class="clickable" @click.left="daysCounter++" @click.right="daysCounter--">
					<v-icon size="small">mdi-white-balance-sunny</v-icon>
					{{ $t("status.day") + daysCounter }}
				</span>
				|
				<span class="clickable" @click.left="nextSeason" @click.right="previousSeason">
					<v-icon size="small">mdi-flower</v-icon>
					{{ currentSeason }}
				</span>
			</div>
		</template>
		{{ $t("status.action") }}
	</v-tooltip>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { computed } from "vue";
import { Season } from "@/js/types";
import { useStore } from "@/store/index";

const store = useStore();
const daysCounter = computed({
	get() {
		return store.days;
	},
	set(val) {
		store.commitAndSave({ commit: "setDaysCount", payload: val });
	},
});

const currentSeason = computed({
	get() {
		return $t(`status.seasons.${store.season}`);
	},
	set(val) {
		store.commitAndSave({ commit: "setSeason", payload: val });
	},
});

function previousSeason() {
	const values = Object.values(Season);
	const index = values.findIndex((entry) => entry === store.season);
	if (index > -1) {
		if (index > 0) currentSeason.value = values[index - 1];
		else currentSeason.value = values[values.length - 1];
	}
}
function nextSeason() {
	const values = Object.values(Season);
	let index = values.findIndex((entry) => entry === store.season);
	if (index > -1) {
		if (index < values.length - 1) currentSeason.value = values[index + 1];
		else currentSeason.value = values[0];
	}
}
</script>
<style scoped>
.clickable:hover {
	cursor: pointer;
}
</style>
