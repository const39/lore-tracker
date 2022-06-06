<template>
	<v-tooltip bottom>
		<template v-slot:activator="{ on, attrs }">
			<div class="d-inline text-body-2" v-on="on" v-bind="attrs">
				<span class="clickable" @click.left="daysCounter++" @click.right="daysCounter--">
					<v-icon small>mdi-white-balance-sunny</v-icon>
					{{ $t("status.day") + daysCounter }}
				</span>
				|
				<span class="clickable" @click.left="nextSeason" @click.right="previousSeason">
					<v-icon small>mdi-flower</v-icon>
					{{ currentSeason }}
				</span>
			</div>
		</template>
		{{ $t("status.action") }}
	</v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import { Season } from "@/js/types";

export default Vue.extend({
	methods: {
		previousSeason() {
			const values = Object.values(Season);
			const index = values.findIndex((entry) => entry === this.$store.state.season);
			if (index > -1) {
				if (index > 0) this.currentSeason = values[index - 1];
				else this.currentSeason = values[values.length - 1];
			}
		},
		nextSeason() {
			const values = Object.values(Season);
			let index = values.findIndex((entry) => entry === this.$store.state.season);
			if (index > -1) {
				if (index < values.length - 1) this.currentSeason = values[index + 1];
				else this.currentSeason = values[0];
			}
		},
	},
	computed: {
		daysCounter: {
			get() {
				return this.$store.state.days;
			},
			set(val) {
				this.$store.commit("changeDaysCount", val);
			},
		},
		currentSeason: {
			get() {
				return this.$t(`status.seasons.${this.$store.state.season}`);
			},
			set(val) {
				this.$store.commit("changeSeason", val);
			},
		},
	},
});
</script>
<style scoped>
.clickable:hover {
	cursor: pointer;
}
</style>
