<template>
	<v-container>
		<v-row class="my-3 d-flex align-center">
			<div>
				<div class="text-xl-h4 mb-2">{{ $t("pages.home") }}</div>
				<StatusTray />
			</div>
			<v-spacer></v-spacer>
			<SearchView />
			<v-divider vertical class="ml-3 mr-1"></v-divider>
			<v-item-group mandatory v-model="selectedLayout">
				<v-item v-slot="{ active, toggle }">
					<v-btn icon :color="active ? 'accent' : ''" @click="toggle">
						<v-icon>mdi-tab</v-icon>
					</v-btn>
				</v-item>
				<v-item v-slot="{ active, toggle }">
					<v-btn icon :color="active ? 'accent' : ''" @click="toggle">
						<v-icon>mdi-view-column-outline</v-icon>
					</v-btn>
				</v-item>
			</v-item-group>
		</v-row>

		<!-- Alternative layouts -->
		<LayoutTabs v-if="selectedLayout === 0" />
		<LayoutColumns v-else-if="selectedLayout === 1" />

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
	</v-container>
</template>

<script>
import LayoutTabs from "../components/layouts/LayoutTabs.vue";
import LayoutColumns from "../components/layouts/LayoutColumns.vue";

import FormObjective from "../components/forms/FormObjective.vue";
import FormEvent from "../components/forms/FormEvent.vue";
import FormLocation from "../components/forms/FormLocation.vue";
import FormCharacter from "../components/forms/FormCharacter.vue";
import FormNote from "../components/forms/FormNote.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";

import SearchView from "../components/SearchView.vue";
import StatusTray from "../components/StatusTray.vue";

import { Objective, Event, Character, Location, Note } from "../js/model.js";
import { eventHub } from "../js/eventHub.js";

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
		StatusTray,
	},
	data() {
		return {
			selectedLayout: 0,
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
	mounted() {
		/**
		 * All events catched here must be CardEvent objects (imported from eventHub.js).
		 */

		eventHub.$on("edit", (e) => {
			this[`${e.type}EditForm`].id = e.object.id;
			this[`${e.type}EditForm`].show = true;
		});

		eventHub.$on("delete", (e) => {
			if (e.object instanceof Objective) this.confirmDialog.message = this.$t("dialogs.deleteObjective");
			else if (e.object instanceof Event) this.confirmDialog.message = this.$t("dialogs.deleteEvent");
			else if (e.object instanceof Location) this.confirmDialog.message = this.$t("dialogs.deleteLocation");
			else if (e.object instanceof Character) this.confirmDialog.message = this.$t("dialogs.deleteCharacter");
			else if (e.object instanceof Note) this.confirmDialog.message = this.$t("dialogs.deleteNote");
			else {
				console.error(e.object, "is not an instance of an accepted object.");
				return;
			}

			this.confirmDialog.title = `${this.$t("dialogs.deleteTitle")} "${e.object.title ||
				e.object.name ||
				e.object.desc}" ?`;
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
