<template>
	<v-card class="mb-4">
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1">
					<v-icon large>mdi-sword-cross</v-icon>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<p class="text--primary">{{ desc }}</p>
					<v-chip class="mx-1">
						<v-icon left>mdi-home</v-icon>
						{{ locationName }}
					</v-chip>
					<v-chip v-for="characterId in charactersIds" :key="characterId" outlined class="mx-1">
						<v-icon left>mdi-account</v-icon>
						{{ characterName(characterId) }}
					</v-chip>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import storage from "../../js/storage.js";

export default {
	name: "EventCard",
	props: {
		id: Number,
		order: Number,
		desc: String,
		locationId: Number,
		charactersIds: Array,
		type: String,
	},
    methods: {
        characterName(characterId) {
            return storage.data.characters.find((entry) => entry.id === characterId).name;
        }
    },
	computed: {
		locationName() {
			return storage.data.locations.find((entry) => entry.id === this.locationId).name;
		},
	},
};
</script>

<style></style>
