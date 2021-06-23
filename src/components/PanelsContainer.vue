<template>
	<div>
		<v-row class="my-3 d-flex">
			<div class="text-xl-h4">
				Lore tracker
			</div>
			<v-spacer></v-spacer>
			<!-- TODO filtering not implemented -->
			<SearchView />
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
		<LayoutTabs v-if="selectedLayout == 'tabbed'" />
		<LayoutColumns v-else-if="selectedLayout == 'column'" />

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

import { Objective, Event, Character, Location, Note } from "../js/model.js";
import { eventHub } from "../js/eventHub.js";
import SearchView from "./SearchView.vue";

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
			this[`${e.type}EditForm`].id = e.object.id;
			this[`${e.type}EditForm`].show = true;
		});

		eventHub.$on("delete", (e) => {

			if (e.object instanceof Objective)
				this.confirmDialog.message = "Voulez-vous vraiment supprimer cet objectif ?";
			else if (e.object instanceof Event)
				this.confirmDialog.message =
					"Voulez-vous vraiment supprimer cet événement ? Cette action modifiera également la frise des événements.";
			else if (e.object instanceof Location)
				this.confirmDialog.message = "Voulez-vous vraiment supprimer ce personnage ?";
			else if (e.object instanceof Character)
				this.confirmDialog.message = "Voulez-vous vraiment supprimer cette localité ?";
			else if (e.object instanceof Note)
				this.confirmDialog.message = "Voulez-vous vraiment supprimer cette note ?";
			else {
				console.error(e.object, "is not an instance of an accepted object.");
				return;
			}

			this.confirmDialog.title = `Supprimer "${e.object.title || e.object.name || e.object.desc}" ?`;
			this.confirmDialog.acceptAction = () => this.$store.commit("delete", e.object);
			this.confirmDialog.show = true;
		});
	},
	beforeDestroy() {
		eventHub.$off("edit");
		eventHub.$off("delete");
	},
};
</script>

<style></style>
