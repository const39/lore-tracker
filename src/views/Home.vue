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

<script lang="ts">
import Vue from "vue";
import LayoutTabs from "@/components/layouts/LayoutTabs.vue";
import LayoutColumns from "@/components/layouts/LayoutColumns.vue";

import ConfirmDialog from "@/components/ConfirmDialog.vue";

import SearchView from "@/components/SearchView.vue";
import StatusTray from "@/components/StatusTray.vue";

import { CardEvent, eventHub } from "@/js/eventHub";
import { CardCategory } from "@/js/types";
import utilities from "../js/utilities";

export default Vue.extend({
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
				title: "",
				message: "",
				acceptAction: () => {},
			},
			rules: {
				required: (v:string) => !!v || this.$t("fields.requiredField"),
				counter: (v:string) => v.length <= 30 || "30 max.",
			},
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
		 * All events catched here must be CardEvent objects (imported from eventHub).
		 */

		eventHub.$on("delete", (e: CardEvent) => {
			this.confirmDialog.message = this.$t(`dialogs.delete${utilities.capitalize(e.card._category)}`);
			let title: string;
			switch (e.card._category) {
				case CardCategory.Character:
				case CardCategory.Location:
					title = e.card.name;
					break;
				case CardCategory.Quest:
				case CardCategory.Note:
					title = e.card.title;
					break;
				default:
					title = e.card.desc;
					break;
			}
			this.confirmDialog.title = `${this.$t("dialogs.deleteTitle")} "${title}" ?`;
			this.confirmDialog.acceptAction = () => this.$store.commit("delete", e.card);
			this.confirmDialog.show = true;
		});
	},
	beforeDestroy() {
		eventHub.$off("delete");
	},
});
</script>

<style></style>
