<template>
	<v-container>
		<v-row class="my-3 d-flex align-center">
			<div>
				<v-hover v-slot="{ hover }">
					<div class="text-xl-h4 mb-2">
						<v-form v-if="editName">
							<v-text-field
							autofocus
								v-model="campaignName"
								counter
								maxlength="30"
								:rules="[rules.required, rules.counter]"
								append-outer-icon="mdi-check"
								@click:append-outer="editName = false"
								@keypress.enter="editName = false"
							></v-text-field>
						</v-form>
						<span v-else>
							{{ campaignName }}
							<v-icon v-show="hover" @click="editName = true">mdi-pencil</v-icon>
						</span>
					</div>
				</v-hover>

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
		ConfirmDialog,
		SearchView,
		StatusTray,
	},
	data() {
		return {
			selectedLayout: 0,
			editName: false,
			confirmDialog: {
				show: false,
				title: undefined,
				message: undefined,
				acceptAction: undefined,
			},
			rules: {
				required: v => !!v || this.$t('fields.requiredField'),
				counter: v => v.length <= 30 || '30 max.'
			}
		};
	},
	computed: {
		campaignName: {
			get() {
				return this.$store.state.name;
			},
			set(value) {
				if (value) this.$store.commit("changeName", value);
			},
		},
	},
	mounted() {
		/**
		 * All events catched here must be CardEvent objects (imported from eventHub.js).
		 */

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
		eventHub.$off("delete");
	},
};
</script>

<style></style>
