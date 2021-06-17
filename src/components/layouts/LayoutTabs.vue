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
							<CardObjective class="draggable" :item-data="objective"/>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<CardAdd @add-card-clicked="showObjectiveForm = true"/>
							</v-col>
						</template>
					</draggable>
					<FormObjective v-model="showObjectiveForm"/>
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
							<CardEvent class="draggable" :item-data="event" :show-icon="true"/>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<CardAdd @add-card-clicked="showEventForm = true"/>
							</v-col>
						</template>
					</draggable>
					<FormEvent v-model="showEventForm"/>
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
							<CardLocation class="draggable" :item-data="location"/>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<CardAdd @add-card-clicked="showLocationForm = true"/>
							</v-col>
						</template>
					</draggable>
					<FormLocation v-model="showLocationForm"/>
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
							<CardCharacter class="draggable" :item-data="character"/>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<CardAdd @add-card-clicked="showCharacterForm = true"/>
							</v-col>
						</template>
					</draggable>
					<FormCharacter v-model="showCharacterForm"/>
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
							<CardNote class="draggable" :item-data="note"/>
						</v-col>
						<template v-slot:footer>
							<v-col cols="12" md="4">
								<CardAdd @add-card-clicked="showNoteForm = true"/>
							</v-col>
						</template>
					</draggable>
					<FormNote v-model="showNoteForm"/>
				</v-container>
			</v-tab-item>
		</v-tabs-items>
	</v-container>
</template>

<script>
import CardObjective from "../cards/CardObjective.vue";
import CardEvent from "../cards/CardEvent.vue";
import CardLocation from "../cards/CardLocation.vue";
import CardCharacter from "../cards/CardCharacter.vue";
import CardNote from "../cards/CardNote.vue";
import CardAdd from "../cards/CardAdd.vue";

import FormEvent from "../forms/FormEvent.vue";
import FormObjective from "../forms/FormObjective.vue";
import FormLocation from "../forms/FormLocation.vue";
import FormCharacter from "../forms/FormCharacter.vue";
import FormNote from "../forms/FormNote.vue";

import draggable from "vuedraggable";

import storage from "../../js/storage.js";
import icons from '../../js/icons';

export default {
	name: "LayoutTabs",
	components: {
		CardObjective,
		CardEvent,
		CardLocation,
		CardCharacter,
		CardNote,
		CardAdd,
		FormEvent,
		FormObjective,
		FormLocation,
		FormCharacter,
		FormNote,
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
