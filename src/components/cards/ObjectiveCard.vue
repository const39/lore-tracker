<template>
	<v-card class="mb-4">
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
		</v-card-text>
	</v-card>
</template>

<script>
import storage from "../../js/storage.js";
import icons from "../../js/icons.js";

export default {
	name: "ObjectiveCard",
	props: {
		id: Number,
		order: Number,
		desc: String,
		locationId: Number,
		charactersIds: Array,
	},
	data() {
		return {
			icons: icons,
		};
	},
	methods: {
		characterName(characterId) {
			if (characterId != undefined) return storage.data.characters.find((entry) => entry.id === characterId).name;
			else return "";
		},
	},
	computed: {
		locationName() {
			if (this.locationId != undefined)
				return storage.data.locations.find((entry) => entry.id === this.locationId).name;
			else return "";
		},
	},
};
</script>

<style></style>
