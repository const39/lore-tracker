<template>
	<div>
		<v-row class="my-3 d-flex">
			<div class="text-xl-h4">
				Lore tracker
			</div>
			<v-spacer></v-spacer>
			<!-- TODO filtering not implemented -->
			<SearchView :items="liveData"/>
			<v-divider vertical class="ml-3 mr-1"></v-divider>
			<div class="display-selector">
				<v-btn icon :color="color('tabbed')" @click="onClick('tabbed')">
					<v-icon>mdi-tab</v-icon>
				</v-btn>
				<v-btn icon :color="color('column')" @click="onClick('column')">
					<v-icon>mdi-view-column-outline</v-icon>
				</v-btn>
			</div>
		</v-row>

		<!-- Alternative layouts -->
		<LayoutTabs :items="liveData" v-if="selectedLayout == 'tabbed'" />
		<LayoutColumns :items="liveData" v-else-if="selectedLayout == 'column'" />

		<!-- Global edit form for each panel -->
		<FormObjective v-model="objectiveEditForm.show" edit :id="objectiveEditForm.id" />
		<FormEvent v-model="eventEditForm.show" edit :id="eventEditForm.id" />
		<FormCharacter v-model="characterEditForm.show" edit :id="characterEditForm.id" />
		<FormLocation v-model="locationEditForm.show" edit :id="locationEditForm.id" />
		<FormNote v-model="noteEditForm.show" edit :id="noteEditForm.id" />

		<!-- Global delete form for all panels -->
		<ConfirmDialog
			v-model="confirmDialog.show"
			:title="confirmDialog.title"
			:message="confirmDialog.message"
			:acceptAction="confirmDialog.acceptAction"
		/>
	</div>
</template>

<script>
import LayoutTabs from "./layouts/LayoutTabs.vue";
import LayoutColumns from "./layouts/LayoutColumns.vue";

import FormObjective from "./forms/FormObjective.vue";
import FormEvent from "./forms/FormEvent.vue";
import FormLocation from "./forms/FormLocation.vue";
import FormCharacter from "./forms/FormCharacter.vue";
import FormNote from "./forms/FormNote.vue";
import ConfirmDialog from "./ConfirmDialog.vue";

import storage from "../js/storage.js";
import { eventHub } from "../js/eventHub.js";
import SearchView from './SearchView.vue';

export default {
	name: "PanelsContainer",
	components: {
		LayoutTabs,
		LayoutColumns,
		FormObjective,
		FormEvent,
		FormLocation,
		FormCharacter,
		FormNote,
		ConfirmDialog,
		SearchView,
	},
	data() {
		return {
			liveData: storage.data,
			selectedLayout: "tabbed",
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
			this.selectedLayout = name;
		},
		color(name) {
			return this.selectedLayout == name ? "primary" : "grey";
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
