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

		<!-- Global delete form for all panels -->
		<ConfirmDialog
			v-model="confirmDialog.show"
			:title="confirmDialog.title"
			:message="confirmDialog.message"
			:acceptAction="confirmDialog.acceptAction"
		></ConfirmDialog>
	</div>
</template>

<script>
import TabbedPanels from "./TabbedPanels.vue";
import ColumnPanels from "./ColumnPanels.vue";

import ObjectiveForm from "./forms/ObjectiveForm.vue";
import EventForm from "./forms/EventForm.vue";
import LocationForm from "./forms/LocationForm.vue";
import CharacterForm from "./forms/CharacterForm.vue";
import NoteForm from "./forms/NoteForm.vue";
import ConfirmDialog from "./ConfirmDialog.vue";

import storage from "../js/storage.js";
import { eventHub } from "../js/eventHub.js";

export default {
	name: "PanelsContainer",
	components: {
		TabbedPanels,
		ColumnPanels,
		ObjectiveForm,
		EventForm,
		LocationForm,
		CharacterForm,
		NoteForm,
		ConfirmDialog,
	},
	data() {
		return {
			selectedDisplay: "tabbed",

			objectiveEditForm: {
				show: false,
				id: undefined,
			},
			eventEditForm: {
				show: false,
				id: undefined,
			},
			locationEditForm: {
				show: false,
				id: undefined,
			},
			characterEditForm: {
				show: false,
				id: undefined,
			},
			noteEditForm: {
				show: false,
				id: undefined,
			},
			confirmDialog: {
				show: false,
				title: undefined,
				message: undefined,
				acceptAction: undefined,
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
		/**
		 * All events catched here must be CardEvent objects (imported from eventHub.js).
		 */

		eventHub.$on("edit", (e) => {
			let type = e.type.toString().toLowerCase();
			this[`${type}EditForm`].id = e.object.id;
			this[`${type}EditForm`].show = true;
			console.log('parent ', this[`${type}EditForm`]);
		});

		eventHub.$on("delete", (e) => {
			let type = e.type.toString().toLowerCase();
			let objectToDelete = storage.data[`${type}s`].find((entry) => entry.id === e.object.id);

			if (objectToDelete) {
				switch (type) {
					case "objective":
						this.confirmDialog.title = `Supprimer "${objectToDelete.desc}" ?`;
						this.confirmDialog.message = "Voulez-vous vraiment supprimer cet objectif ?";
						this.confirmDialog.acceptAction = () => storage.deleteObjective(e.object.id);
						break;
					case "event":
						this.confirmDialog.title = `Supprimer "${objectToDelete.desc}" ?`;
						this.confirmDialog.message =
							"Voulez-vous vraiment supprimer cet événement ? Cette action modifiera également la frise des événements.";
						this.confirmDialog.acceptAction = () => storage.deleteEvent(e.object.id);
						break;
					case "character":
						this.confirmDialog.title = `Supprimer "${objectToDelete.name}" ?`;
						this.confirmDialog.message = "Voulez-vous vraiment supprimer ce personnage ?";
						this.confirmDialog.acceptAction = () => storage.deleteCharacter(e.object.id);
						break;
					case "location":
						this.confirmDialog.title = `Supprimer "${objectToDelete.name}" ?`;
						this.confirmDialog.message = "Voulez-vous vraiment supprimer cette localité ?";
						this.confirmDialog.acceptAction = () => storage.deleteLocation(e.object.id);
						break;
					case "note":
						this.confirmDialog.title = `Supprimer "${objectToDelete.title || objectToDelete.desc}" ?`;
						this.confirmDialog.message = "Voulez-vous vraiment supprimer cette note ?";
						this.confirmDialog.acceptAction = () => storage.deleteNote(e.object.id);
						break;
				}

				this.confirmDialog.show = true;
			}
		});
	},
	beforeDestroy() {
		eventHub.$off("edit");
		eventHub.$off("delete");
	},
};
</script>

<style></style>
