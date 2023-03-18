<template>
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
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import Banner from "@/components/banner/Banner.vue";
import LorebookActions from "@/components/banner/actions/LorebookActions.vue";

import LayoutTabs from "@/components/layouts/LayoutTabs.vue";
import LayoutColumns from "@/components/layouts/LayoutColumns.vue";

import ConfirmDialog from "@/components/ConfirmDialog.vue";

import { CardEvent, useEventHub } from "@/js/eventHub";
import utilities from "../js/utilities";
import { Order } from "@/js/types";
import { useStore } from "@/store";

const selectedLayout = ref(0);
const confirmDialog = ref({
	show: false,
	title: "",
	message: "",
	acceptAction: () => {},
});
const store = useStore();
const eventHub = useEventHub();

function selectLayout(value: number) {
	selectedLayout.value = value;
}
/**
 * Update card order when selection changes
 */
function selectOrder(value: number) {
	store.setOrder(value === 1 ? Order.ALPHANUMERIC : Order.DEFAULT);
}
onMounted(() => {
	eventHub.on(CardEvent.ID, (e: CardEvent) => {
		confirmDialog.value.message = $t(`dialogs.delete${utilities.capitalize(e.card._category)}`);
		confirmDialog.value.title = `${$t("dialogs.deleteTitle")} "${utilities.getText(e.card)}" ?`;
		confirmDialog.value.acceptAction = () => store.commitAndSave({ commit: "deleteCard", payload: e.card });
		confirmDialog.value.show = true;
	});
});
onBeforeUnmount(() => {
	eventHub.off(CardEvent.ID);
});
</script>

<style></style>
