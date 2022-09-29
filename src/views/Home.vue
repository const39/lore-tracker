<template>
	<v-container>
		<Banner>
			<template v-slot:actions>
				<LorebookActions @layout="selectLayout" @order="selectOrder"></LorebookActions>
			</template>
		</Banner>

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

import Banner from "@/components/banner/Banner.vue";
import LorebookActions from "@/components/banner/actions/LorebookActions.vue";

import LayoutTabs from "@/components/layouts/LayoutTabs.vue";
import LayoutColumns from "@/components/layouts/LayoutColumns.vue";

import ConfirmDialog from "@/components/ConfirmDialog.vue";

import { CardEvent, eventHub } from "@/js/eventHub";
import utilities from "../js/utilities";
import { Order } from "@/js/types";

export default Vue.extend({
	name: "PanelsContainer",
	components: {
		Banner,
		LorebookActions,
		LayoutTabs,
		LayoutColumns,
		ConfirmDialog,
	},
	data() {
		return {
			selectedLayout: 0,
			confirmDialog: {
				show: false,
				title: "",
				message: "",
				acceptAction: () => {},
			},
		};
	},
	methods: {
		selectLayout(value: number) {
			this.selectedLayout = value;
		},
		/**
		 * Update card order when selection changes
		 */
		selectOrder(value: number) {
			this.$store.commit("setOrder", value === 1 ? Order.ALPHANUMERIC : Order.DEFAULT);
		},
	},
	mounted() {
		eventHub.$on(CardEvent.ID, (e: CardEvent) => {
			this.confirmDialog.message = this.$t(`dialogs.delete${utilities.capitalize(e.card._category)}`);
			this.confirmDialog.title = `${this.$t("dialogs.deleteTitle")} "${utilities.getText(e.card)}" ?`;
			this.confirmDialog.acceptAction = () =>
				this.$store.dispatch("commitAndSave", { commit: "deleteCard", payload: e.card });
			this.confirmDialog.show = true;
		});
	},
	beforeDestroy() {
		eventHub.$off(CardEvent.ID);
	},
});
</script>

<style></style>
