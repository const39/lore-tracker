<template>
	<v-tooltip bottom>
		<template v-slot:activator="{ on, attrs }">
			<div class="d-inline text-body-2" v-on="on" v-bind="attrs">
				<span class="clickable" @click.left="daysCounter++" @click.right="daysCounter--">
					<v-icon small>mdi-white-balance-sunny</v-icon>
					Jour {{ daysCounter }}
				</span>
				|
				<span class="clickable" @click.left="nextSeason" @click.right="previousSeason">
					<v-icon small>mdi-flower</v-icon>
					{{ currentSeason }}
				</span>
			</div>
		</template>
        Cliquez pour augmenter ou diminuer
	</v-tooltip>
</template>

<script>
import constants from "../js/constants";

export default {
	methods: {
		previousSeason() {
			const values = Object.values(constants.seasons);
			const index = values.findIndex((entry) => entry === this.$store.state.season);
			if (index > -1) {
				if (index > 0) this.currentSeason = values[index - 1];
				else this.currentSeason = values[values.length - 1];
			}
		},
		nextSeason() {
			const values = Object.values(constants.seasons);
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
				switch (this.$store.state.season) {
					case constants.seasons.SPRING:
						return "Printemps";
					case constants.seasons.SUMMER:
						return "Été";
					case constants.seasons.AUTUMN:
						return "Automne";
					case constants.seasons.WINTER:
						return "Hiver";
				}
				return "";
			},
			set(val) {
				this.$store.commit("changeSeason", val);
			},
		},
	},
};
</script>
<style scoped>
.clickable:hover {
    cursor: pointer;
}
</style>