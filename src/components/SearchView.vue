<template>
	<span>
		<v-btn @click="shown = !shown">
			<v-icon>mdi-magnify</v-icon>
			Rechercher
		</v-btn>
		<v-snackbar light top max-width="70%" transition="scroll-y-transition" :timeout="-1" v-model="shown">
			<v-row class="d-flex pt-3">
				<v-select
					outlined
					dense
					class="mx-2 flex-grow-0 flex-shrink-1"
					label="Type"
					v-model="selectedType"
					:items="types"
				>
					<template v-slot:selection="data">
						<v-icon left small> {{ data.item.icon }} </v-icon>
						{{ data.item.text }}
					</template>
					<template v-slot:item="data">
						<v-icon left small> {{ data.item.icon }} </v-icon>
						{{ data.item.text }}
					</template>
				</v-select>
				<v-text-field
					solo
					dense
					class="mx-2 flex-grow-1 flex-shrink-1"
					label="Contient"
					hint="Contient"
					v-model="contains"
				></v-text-field>
				<TagChooser solo dense class="mx-2 flex-grow-0 flex-shrink-1" :overflow="true" v-model="selectedTags" />
				<v-btn icon @click="search">
					<v-icon>mdi-magnify</v-icon>
				</v-btn>
				<v-btn icon @click="shown = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-row>
			<!-- <span class="grey--text text-caption">15 résultats</span> -->
		</v-snackbar>
	</span>
</template>

<script>
import storage from "../js/storage";
import icons from "../js/icons";

import TagChooser from "./TagChooser.vue";

export default {
	components: {
		TagChooser,
	},
	props: {
		items: storage.schema
	},
	data() {
		return {
			shown: false,
			types: [
				{
					value: "all",
					text: "Tous",
					icon: undefined,
				},
				{
					value: "objectives",
					text: "Objectifs",
					icon: icons.objective,
				},
				{
					value: "events",
					text: "Événements",
					icon: icons.event,
				},
				{
					value: "locations",
					text: "Localités",
					icon: icons.location,
				},
				{
					value: "characters",
					text: "Personnages",
					icon: icons.character,
				},
				{
					value: "notes",
					text: "Notes",
					icon: icons.note,
				},
			],
			selectedType: "all",
			contains: undefined,
			selectedTags: [],
		};
	},
	methods: {
		search() {
			// TODO
		}
	},
	computed: {
		style() {
			return this.shown ? "display: block;" : "display: none;";
		},
	},
};
</script>

