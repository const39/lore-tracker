<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
			<ObjectiveForm v-model="showEditDialog" edit :id="id"></ObjectiveForm>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text--primary">{{ desc }}</p>
			<v-chip class="mx-1" v-if="locationName">
				<v-icon left>{{ icons.location }}</v-icon>
				{{ locationName }}
			</v-chip>
			<v-chip v-for="characterId in charactersIds" :key="characterId" outlined class="mx-1">
				<v-icon left>{{ icons.player }}</v-icon>
				{{ characterName(characterId) }}
			</v-chip>
			<v-tooltip top v-if="isCompleted">
				<template v-slot:activator="{ on, attrs }">
					<v-icon v-bind="attrs" v-on="on">{{ icons.completed }}</v-icon>
				</template>
				<span>Accompli</span>
			</v-tooltip>
		</v-card-text>
	</v-card>
</template>

<script>
import storage from "../../js/storage.js";
import icons from "../../js/icons.js";

import CardOptions from "./CardOptions.vue";
import ObjectiveForm from "../forms/ObjectiveForm.vue";

export default {
	name: "ObjectiveCard",
	components: {
		CardOptions,
		ObjectiveForm,
	},
	props: {
		id: Number,
		desc: String,
		isCompleted: Boolean,
		locationId: Number,
		charactersIds: Array,
	},
	data() {
		return {
			icons: icons,
			showEditDialog: false,
		};
	},
	methods: {
		characterName(characterId) {
			if (characterId != undefined) {
				let char = storage.data.characters.find((entry) => entry.id === characterId);
				if (char) return char.name;
			}
			return "";
		},
		onOptionSelected(value) {
			if (value === "edit") this.showEditDialog = true;
			// else if (value === "delete") console.log('delete');
		},
	},
	computed: {
		locationName() {
			if (this.locationId != undefined) {
				let loc = storage.data.locations.find((entry) => entry.id === this.locationId);
				if (loc) return loc.name;
			}
			return "";
		},
	},
};
</script>

<style></style>
