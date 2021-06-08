<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="4" sm="2">
                <v-card>
                    <v-card-title> {{panels[0]}} </v-card-title>
                    <v-card-text>
                        <ObjectiveCard v-for="objective in liveData.objectives" :key="objective.id" v-bind="objective"></ObjectiveCard>
                        <ObjectiveForm></ObjectiveForm>
                    </v-card-text>
                </v-card>
			</v-col>
			<v-col cols="12" md="4" sm="2">
                <v-card>
                    <v-card-title> {{panels[1]}} </v-card-title>
                    <v-card-text>
                        <EventCard v-for="event in liveData.events" :key="event.id" v-bind="event"></EventCard>
                        <EventForm></EventForm>
                    </v-card-text>
                </v-card>
			</v-col>
			<v-col cols="12" md="4" sm="2">
                <v-card>
                    <v-card-title> {{panels[2]}} </v-card-title>
                    <v-card-text>
                        <LocationCard v-for="location in liveData.locations" :key="location.id" v-bind="location"></LocationCard>
                        <LocationForm></LocationForm>
                    </v-card-text>
                </v-card>
			</v-col>
			<v-col cols="12" md="4" sm="2">
                <v-card>
                    <v-card-title> {{panels[3]}} </v-card-title>
                    <v-card-text>
                        <CharacterCard v-for="character in liveData.characters" :key="character.id" v-bind="character"></CharacterCard>
                        <CharacterForm></CharacterForm>
                    </v-card-text>
                </v-card>
			</v-col>
			<v-col cols="12" md="4" sm="2">
                <v-card>
                    <v-card-title> {{panels[4]}} </v-card-title>
                    <v-card-text>
                        <NoteCard v-for="note in liveData.notes" :key="note.id" v-bind="note"></NoteCard>
                        <NoteForm></NoteForm>
                    </v-card-text>
                </v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
// import Panel from "./Panel.vue";

import ObjectiveCard from "./cards/ObjectiveCard.vue";
import EventCard from "./cards/EventCard.vue";
import LocationCard from "./cards/LocationCard.vue";
import CharacterCard from "./cards/CharacterCard.vue";
import NoteCard from "./cards/NoteCard.vue";

import EventForm from "./forms/EventForm.vue";
import ObjectiveForm from "./forms/ObjectiveForm.vue";
import LocationForm from "./forms/LocationForm.vue";
import CharacterForm from "./forms/CharacterForm.vue";
import NoteForm from "./forms/NoteForm.vue";

import storage from "../js/storage.js";

export default {
	name: "ColumnPanels",
	components: {
		// Panel,
		ObjectiveCard,
		EventCard,
		LocationCard,
		CharacterCard,
		NoteCard,
		EventForm,
		ObjectiveForm,
		LocationForm,
		CharacterForm,
		NoteForm,
	},
	data() {
		return {
			panels: ["Objectifs", "Événements", "Localités", "Personnages", "Notes"],
			liveData: storage.data,
		};
	},
};
</script>

<style></style>
