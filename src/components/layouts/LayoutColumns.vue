<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="4" sm="12">
				<v-expansion-panels v-model="isObjectiveCollapsed">
					<v-expansion-panel>
						<v-expansion-panel-header class="text-h5 text--primary">
							{{ panels[0] }}
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<draggable
								v-model="liveData.objectives"
								group="objectives"
								@start="drag = true"
								@end="
									drag = false;
									persist();
								"
							>
								<CardObjective
									class="draggable"
									v-for="objective in liveData.objectives"
									:key="objective.id"
									:item-data="objective"
								/>
							</draggable>
							<CardAdd @add-card-clicked="showObjectiveForm = true"/>
							<FormObjective v-model="showObjectiveForm"/>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
			<v-col cols="12" md="4" sm="12">
				<v-expansion-panels v-model="isEventCollapsed">
					<v-expansion-panel>
						<v-expansion-panel-header class="text-h5 text--primary">
							{{ panels[1] }}
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<draggable
								v-model="liveData.events"
								group="events"
								@start="drag = true"
								@end="
									drag = false;
									persist();
								"
							>
								<CardEvent
									class="draggable"
									v-for="event in liveData.events"
									:key="event.id"
									:item-data="event"
									:show-icon="true"
								/>
							</draggable>
							<CardAdd @add-card-clicked="showEventForm = true"/>
							<FormEvent v-model="showEventForm"/>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
			<v-col cols="12" md="4" sm="12">
				<v-expansion-panels v-model="isLocationCollapsed">
					<v-expansion-panel>
						<v-expansion-panel-header class="text-h5 text--primary">
							{{ panels[2] }}
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<draggable
								v-model="liveData.locations"
								group="locations"
								@start="drag = true"
								@end="
									drag = false;
									persist();
								"
							>
								<CardLocation
									class="draggable"
									v-for="location in liveData.locations"
									:key="location.id"
									:item-data="location"
								/>
							</draggable>
							<CardAdd @add-card-clicked="showLocationForm = true"/>
							<FormLocation v-model="showLocationForm"/>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
			<v-col cols="12" md="4" sm="12">
				<v-expansion-panels v-model="isCharacterCollapsed">
					<v-expansion-panel>
						<v-expansion-panel-header class="text-h5 text--primary">
							{{ panels[3] }}
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<draggable
								v-model="liveData.characters"
								group="characters"
								@start="drag = true"
								@end="
									drag = false;
									persist();
								"
							>
								<CardCharacter
									class="draggable"
									v-for="character in liveData.characters"
									:key="character.id"
									:item-data="character"
								/>
							</draggable>
							<CardAdd @add-card-clicked="showCharacterForm = true"/>
							<FormCharacter v-model="showCharacterForm"/>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
			<v-col cols="12" md="4" sm="12">
				<v-expansion-panels v-model="isNoteCollapsed">
					<v-expansion-panel>
						<v-expansion-panel-header class="text-h5 text--primary">
							{{ panels[4] }}
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<draggable
								v-model="liveData.notes"
								group="notes"
								@start="drag = true"
								@end="
									drag = false;
									persist();
								"
							>
								<CardNote
									class="draggable"
									v-for="note in liveData.notes"
									:key="note.id"
									:item-data="note"
								/>
							</draggable>
							<CardAdd @add-card-clicked="showNoteForm = true"/>
							<FormNote v-model="showNoteForm"/>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
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

export default {
	name: "LayoutColumns",
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
			panels: ["Objectifs", "Événements", "Localités", "Personnages", "Notes"],
			liveData: storage.data,
			showObjectiveForm: false,
			showEventForm: false,
			showLocationForm: false,
			showCharacterForm: false,
			showNoteForm: false,
			isObjectiveCollapsed: 0,
			isEventCollapsed: 0,
			isLocationCollapsed: 0,
			isCharacterCollapsed: 0,
			isNoteCollapsed: 0,
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
