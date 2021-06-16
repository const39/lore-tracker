<template>
	<v-container>
		<v-tabs fixed-tabs v-model="activeTab">
			<v-tab v-for="tab in tabs" :key="tab.name">
				<v-icon left>{{ tab.icon }}</v-icon>
				{{ tab.title }}
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="activeTab">
			<v-tab-item>
				<v-container>
					<draggable
						tag="v-row"
						draggable=".item"
						v-model="liveData.objectives"
						group="objectives"
						@start="drag = true"
						@end="
							drag = false;
							persist();
						"
					>
						<v-col
							cols="12"
							md="4"
							class="item"
							v-for="objective in liveData.objectives"
							:key="objective.id"
						>
							<ObjectiveCard class="draggable" v-bind="objective"></ObjectiveCard>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<AddCard @add-card-clicked="showObjectiveForm = true"></AddCard>
							</v-col>
						</template>
					</draggable>
					<ObjectiveForm v-model="showObjectiveForm"></ObjectiveForm>
				</v-container>
			</v-tab-item>
			<v-tab-item>
				<v-container>
					<draggable
						tag="v-row"
						draggable=".item"
						v-model="liveData.events"
						group="events"
						@start="drag = true"
						@end="
							drag = false;
							persist();
						"
					>
						<v-col cols="12" md="4" class="item" v-for="event in liveData.events" :key="event.id">
							<EventCard class="draggable" v-bind="event"></EventCard>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<AddCard @add-card-clicked="showEventForm = true"></AddCard>
							</v-col>
						</template>
					</draggable>
					<EventForm v-model="showEventForm"></EventForm>
				</v-container>
			</v-tab-item>
			<v-tab-item>
				<v-container>
					<draggable
						tag="v-row"
						draggable=".item"
						v-model="liveData.locations"
						group="locations"
						@start="drag = true"
						@end="
							drag = false;
							persist();
						"
					>
						<v-col cols="12" md="4" class="item" v-for="location in liveData.locations" :key="location.id">
							<LocationCard class="draggable" v-bind="location"></LocationCard>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<AddCard @add-card-clicked="showLocationForm = true"></AddCard>
							</v-col>
						</template>
					</draggable>
					<LocationForm v-model="showLocationForm"></LocationForm>
				</v-container>
			</v-tab-item>
			<v-tab-item>
				<v-container>
					<draggable
						tag="v-row"
						draggable=".item"
						v-model="liveData.characters"
						group="characters"
						@start="drag = true"
						@end="
							drag = false;
							persist();
						"
					>
						<v-col
							cols="12"
							md="4"
							class="item"
							v-for="character in liveData.characters"
							:key="character.id"
						>
							<CharacterCard class="draggable" v-bind="character"></CharacterCard>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<AddCard @add-card-clicked="showCharacterForm = true"></AddCard>
							</v-col>
						</template>
					</draggable>
					<CharacterForm v-model="showCharacterForm"></CharacterForm>
				</v-container>
			</v-tab-item>
			<v-tab-item>
				<v-container>
					<draggable
						tag="v-row"
						draggable=".item"
						v-model="liveData.notes"
						group="notes"
						@start="drag = true"
						@end="
							drag = false;
							persist();
						"
					>
						<v-col cols="12" md="4" class="item" v-for="note in liveData.notes" :key="note.id">
							<NoteCard class="draggable" v-bind="note"></NoteCard>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<AddCard @add-card-clicked="showNoteForm = true"></AddCard>
							</v-col>
						</template>
					</draggable>
					<NoteForm v-model="showNoteForm"></NoteForm>
				</v-container>
			</v-tab-item>
		</v-tabs-items>
	</v-container>
</template>

<script>
import ObjectiveCard from "./cards/ObjectiveCard.vue";
import EventCard from "./cards/EventCard.vue";
import LocationCard from "./cards/LocationCard.vue";
import CharacterCard from "./cards/CharacterCard.vue";
import NoteCard from "./cards/NoteCard.vue";
import AddCard from "./cards/AddCard.vue";

import EventForm from "./forms/EventForm.vue";
import ObjectiveForm from "./forms/ObjectiveForm.vue";
import LocationForm from "./forms/LocationForm.vue";
import CharacterForm from "./forms/CharacterForm.vue";
import NoteForm from "./forms/NoteForm.vue";

import draggable from "vuedraggable";

import storage from "../js/storage.js";
import icons from '../js/icons';

export default {
	name: "TabbedPanels",
	components: {
		ObjectiveCard,
		EventCard,
		LocationCard,
		CharacterCard,
		NoteCard,
		AddCard,
		EventForm,
		ObjectiveForm,
		LocationForm,
		CharacterForm,
		NoteForm,
		draggable,
	},
	data() {
		return {
			tabs: [
				{
					title: "Objectifs",
					icon: icons.objective
				},
				{
					title: "Événements",
					icon: icons.event
				},
				{
					title: "Localités",
					icon: icons.location
				},
				{
					title: "Personnages",
					icon: icons.character
				},
				{
					title: "Notes",
					icon: icons.note
				},
			],

			activeTab: "",
			liveData: storage.data,
			showObjectiveForm: false,
			showEventForm: false,
			showLocationForm: false,
			showCharacterForm: false,
			showNoteForm: false,
		};
	},
	methods: {
		persist() {
			storage.persist();
		},
	},
};
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
