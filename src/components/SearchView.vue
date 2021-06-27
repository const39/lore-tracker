<template>
	<span>
		<v-btn @click="shown = !shown">
			<v-icon>mdi-magnify</v-icon>
			Rechercher
		</v-btn>
		<v-snackbar light top max-width="70%" transition="scroll-y-transition" :timeout="-1" v-model="shown">
			<v-row class="d-flex pt-3">
				<v-text-field
					solo
					dense
					class="mx-2 flex-grow-1 flex-shrink-1"
					label="Contenant"
					hint="Contenant"
					v-model="textToContain"
				></v-text-field>
				<TagChooser solo dense class="mx-2 flex-grow-0 flex-shrink-1" :overflow="true" v-model="selectedTags" />
				<v-select
					outlined
					dense
					class="mx-2 flex-grow-0 flex-shrink-1"
					label="Dans"
					v-model="selectedType"
					:items="types"
				>
					<template v-slot:selection="data">
						<v-icon left small> {{ icons.iconFromObjectType(data.item.value) }} </v-icon>
						{{ data.item.text }}
					</template>
					<template v-slot:item="data">
						<v-icon left small> {{ icons.iconFromObjectType(data.item.value) }} </v-icon>
						{{ data.item.text }}
					</template>
				</v-select>
			</v-row>
			<div class="d-flex">
				<span class="grey--text text-caption"> {{ resultsNumber }} carte(s) affichée(s) </span>
				<v-spacer></v-spacer>
				<span class="grey--text text-caption">Tri des cartes désactivé pendant la recherche.</span>
			</div>
			<template v-slot:action>
				<v-btn icon @click="shown = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</template>
		</v-snackbar>
	</span>
</template>

<script>
import icons from "../js/icons";
import constants from "../js/constants";

import TagChooser from "./TagChooser.vue";

export default {
	components: {
		TagChooser,
	},
	data() {
		return {
			shown: false,
			icons: icons,
			types: [
				{
					value: constants.objectTypes.ALL,
					text: "Tous",
				},
				{
					value: constants.objectTypes.OBJECTIVE,
					text: "Objectifs",
				},
				{
					value: constants.objectTypes.EVENT,
					text: "Événements",
				},
				{
					value: constants.objectTypes.LOCATION,
					text: "Localités",
				},
				{
					value: constants.objectTypes.CHARACTER,
					text: "Personnages",
				},
				{
					value: constants.objectTypes.NOTE,
					text: "Notes",
				},
			],
			selectedType: constants.objectTypes.ALL,
			textToContain: undefined,
			selectedTags: [],
		};
	},
	methods: {
		search() {
			this.$store.commit("changeFilter", {
				type: this.selectedType,
				text: this.textToContain,
				tags: this.selectedTags,
			});
		},
	},
	computed: {
		style() {
			return this.shown ? "display: block;" : "display: none;";
		},
		resultsNumber() {
			return this.$store.state.filter.nbResults;
		},
	},
	watch: {
		/**
		 * Reset filter once the search view is closed
		 */
		shown(newValue) {
			if (!newValue) this.$store.commit("resetFilter");
		},
		/**
		 * Trigger search as soon as a field changes
		 */
		selectedType() {
			this.search();
		},
		textToContain() {
			this.search();
		},
		selectedTags() {
			this.search();
		},
	},
};
</script>
