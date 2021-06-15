<template>
	<div>
		<div class="my-3 d-flex">
			<div class="text-xl-h4">Lore tracker</div>
			<v-spacer></v-spacer>
			<div class="display-selector">
				<v-btn icon :color="color('tabbed')" @click="onClick('tabbed')">
					<v-icon>mdi-tab</v-icon>
				</v-btn>
				<v-btn icon :color="color('column')" @click="onClick('column')">
					<v-icon>mdi-view-column-outline</v-icon>
				</v-btn>
			</div>
		</div>

		<!-- Alternative display modes -->
		<TabbedPanels v-if="selectedDisplay == 'tabbed'"></TabbedPanels>
		<ColumnPanels v-else-if="selectedDisplay == 'column'"></ColumnPanels>

		<!-- Global edit form for each panel -->
		<ObjectiveForm v-model="objectiveEditForm.show" edit :id="objectiveEditForm.id"></ObjectiveForm>
		<EventForm v-model="eventEditForm.show" edit :id="eventEditForm.id"></EventForm>
		<CharacterForm v-model="characterEditForm.show" edit :id="characterEditForm.id"></CharacterForm>
		<LocationForm v-model="locationEditForm.show" edit :id="locationEditForm.id"></LocationForm>
		<NoteForm v-model="noteEditForm.show" edit :id="noteEditForm.id"></NoteForm>
	</div>
</template>

<script>
import TabbedPanels from "./TabbedPanels.vue";
import ColumnPanels from "./ColumnPanels.vue";

import ObjectiveForm from './forms/ObjectiveForm.vue';
import EventForm from './forms/EventForm.vue';
import LocationForm from './forms/LocationForm.vue';
import CharacterForm from './forms/CharacterForm.vue';
import NoteForm from './forms/NoteForm.vue';

import eventHub from "../js/eventHub.js";

export default {
	name: "PanelsContainer",
	components: {
		TabbedPanels,
		ColumnPanels,
		ObjectiveForm,
		EventForm,
		LocationForm,
		CharacterForm,
		NoteForm
	},
	data() {
		return {
			selectedDisplay: "tabbed",

			objectiveEditForm: {
				show: false,
				id: undefined
			},
			eventEditForm: {
				show: false,
				id: undefined
			},
			locationEditForm: {
				show: false,
				id: undefined
			},
			characterEditForm: {
				show: false,
				id: undefined
			},
			noteEditForm: {
				show: false,
				id: undefined
			},
		};
	},
	methods: {
		onClick(name) {
			this.selectedDisplay = name;
		},
		color(name) {
			return this.selectedDisplay == name ? "primary" : "grey";
		},
	},
	mounted() {
		// Listen on 'edit' event
		// e is the object passed by the component emitting the event. It should contain at least 2 properties:
		// 'type': the type of object to edit (e.g. Objective, Character, Location...) 
		// 'id': the id of the object to edit 
		eventHub.$on('edit', (e) => {
			let type = e.type.toString().toLowerCase() 
			this[`${type}EditForm`].id = e.id;
			this[`${type}EditForm`].show = true;
		});
	},
	beforeDestroy() {
		eventHub.$off('edit');
	}
};
</script>

<style></style>
