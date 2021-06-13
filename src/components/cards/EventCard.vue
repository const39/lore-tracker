<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
			<EventForm v-model="showEditDialog" edit :id="id"></EventForm>
			<ConfirmDialog
				v-model="showDeleteDialog"
				:acceptAction="deleteEvent"
				:title="`Supprimer ${desc} ?`"
				:message="'Voulez-vous vraiment supprimer cet événement ? Cette action modifiera également la frise des événements.'"
			></ConfirmDialog>
		</v-card-actions>
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1" v-if="showIcon">
					<v-icon large>{{ icons.whichEventIcon(type) }}</v-icon>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<p class="text--primary">{{ desc }}</p>
					<v-chip class="mx-1" v-if="locationName">
						<v-icon left>{{ icons.location }}</v-icon>
						{{ locationName }}
					</v-chip>
					<v-chip v-for="characterId in charactersIds" :key="characterId" outlined class="mx-1">
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

import CardOptions from "./CardOptions.vue";
import EventForm from "../forms/EventForm.vue";
import ConfirmDialog from "../ConfirmDialog.vue";

export default {
	name: "EventCard",
	components: {
		CardOptions,
		EventForm,
		ConfirmDialog
	},
	props: {
		id: Number,
		desc: String,
		locationId: Number,
		charactersIds: Array,
		type: String,
		showIcon: Boolean
	},
	data() {
		return {
			icons: icons,
			showEditDialog: false,
			showDeleteDialog: false,
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
			if (value === "edit") this.showEditDialog = true;
			else if (value === "delete") this.showDeleteDialog = true;
		},
		deleteEvent() {
			storage.deleteEvent(this.id);
		},
	},
	computed: {
		locationName() {
			if (this.locationId != undefined) {
				let loc = storage.data.locations.find((entry) => entry.id === this.locationId);
				if(loc) return loc.name;
			}
			return "";
		},
	},
};
</script>

<style></style>
