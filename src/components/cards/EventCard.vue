<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
		</v-card-actions>
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1" v-if="showIcon">
					<v-icon large>{{ icons.whichEventIcon(itemData.type) }}</v-icon>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<p class="text--primary">{{ itemData.desc }}</p>
					<v-chip class="mx-1" v-if="locationName">
						<v-icon left>{{ icons.location }}</v-icon>
						{{ locationName }}
					</v-chip>
					<v-chip v-for="characterId in itemData.charactersIds" :key="characterId" outlined class="mx-1">
						<v-icon left>{{ icons.player }}</v-icon>
						{{ characterName(characterId) }}
					</v-chip>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import storage from "../../js/storage.js";
import icons from "../../js/icons.js";
import { Event } from '../../js/model.js';
import {eventHub, CardEvent} from '../../js/eventHub.js';

import CardOptions from "./CardOptions.vue";

export default {
	name: "EventCard",
	components: {
		CardOptions,
	},
	props: {
		itemData: Event,
		showIcon: Boolean
	},
	data() {
		return {
			icons: icons,
		};
	},
	methods: {
		characterName(characterId) {
			if (characterId != undefined) {
				let char = storage.data.characters.find((entry) => entry.id === characterId);
				if(char) return char.name;
			}
			return "";
		},
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent('event', this.itemData))
		},
	},
	computed: {
		locationName() {
			if (this.itemData.locationId != undefined) {
				let loc = storage.data.locations.find((entry) => entry.id === this.itemData.locationId);
				if(loc) return loc.name;
			}
			return "";
		},
	},
};
</script>

<style></style>
