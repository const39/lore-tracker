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
			<div class="text-right">
				<SearchView class="mt-1 mb-2" />
				<span class="grey--text text-caption">{{ cardCount + $t("status.cardCount") }}</span>
			</div>

			<v-divider vertical class="ml-3 mr-1"></v-divider>
			<div>
				<!-- Card ordering selector -->
				<v-item-group class="d-block" mandatory v-model="selectedOrder">
					<v-item v-slot="{ active, toggle }">
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on" :color="active ? 'primary' : ''" @click="toggle">
									<v-icon v-if="active">mdi-sort-clock-descending</v-icon>
									<v-icon v-else>mdi-sort-clock-descending-outline</v-icon>
								</v-btn>
							</template>
							{{ $t("status.selectors.customOrder") }}
						</v-tooltip>
					</v-item>
					<v-item v-slot="{ active, toggle }">
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on" :color="active ? 'primary' : ''" @click="toggle">
									<v-icon>mdi-sort-alphabetical-variant</v-icon>
								</v-btn>
							</template>
							{{ $t("status.selectors.alphanumericOrder") }}
						</v-tooltip>
					</v-item>
				</v-item-group>
				<!-- Layout selector -->
				<v-item-group class="d-block" mandatory v-model="selectedLayout">
					<v-item v-slot="{ active, toggle }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on" :color="active ? 'accent' : ''" @click="toggle">
									<v-icon>mdi-tab</v-icon>
								</v-btn>
							</template>
							{{ $t("status.selectors.tabLayout") }}
						</v-tooltip>
					</v-item>
					<v-item v-slot="{ active, toggle }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on" :color="active ? 'accent' : ''" @click="toggle">
									<v-icon>mdi-view-column-outline</v-icon>
								</v-btn>
							</template>
							{{ $t("status.selectors.columnLayout") }}
						</v-tooltip>
					</v-item>
				</v-item-group>
			</div>
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
			selectedOrder: 0,
			selectedLayout: 0,
			editName: false,
			confirmDialog: {
				show: false,
				title: "",
				message: "",
				acceptAction: () => {},
			},
			rules: {
				required: (v: string) => !!v || this.$t("fields.requiredField"),
				counter: (v: string) => v.length <= 30 || "30 max.",
			},
		};
	},
	computed: {
		cardCount(): number {
			return this.$store.getters.cardCount;
		},
		campaignName: {
			get() {
				return this.$store.state.name;
			},
			set(value) {
				if (value) this.$store.commit("changeName", value);
			},
		},
	},
	watch: {
		/**
		 * Update card order when selection changes
		 */
		selectedOrder(value) {
			// Set boolean as parameter instead of number
			this.$store.commit("changeFilter", { alphanumericSort: !!value });
		},
	},
	mounted() {
		eventHub.$on(CardEvent.ID, (e: CardEvent) => {
			this.confirmDialog.message = this.$t(`dialogs.delete${utilities.capitalize(e.card._category)}`);
			this.confirmDialog.title = `${this.$t("dialogs.deleteTitle")} "${utilities.getText(e.card)}" ?`;
			this.confirmDialog.acceptAction = () => this.$store.commit("delete", e.card);
			this.confirmDialog.show = true;
		});
	},
	beforeDestroy() {
		eventHub.$off(CardEvent.ID);
	},
});
</script>

<style></style>
