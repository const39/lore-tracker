<template>
	<Banner>
		<template #actions>
			<LorebookActions @layout="selectLayout" />
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
		:accept-action="confirmDialog.acceptAction"
	/>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { onBeforeUnmount, onMounted, ref } from "vue";

import Banner from "@/components/banner/Banner.vue";
import LorebookActions from "@/components/banner/actions/LorebookActions.vue";

import LayoutColumns from "@/components/layouts/LayoutColumns.vue";
import LayoutTabs from "@/components/layouts/LayoutTabs.vue";

import ConfirmDialog from "@/components/ConfirmDialog.vue";

import { eventBus } from "@/js/eventBus";
import { Order } from "@/js/types";
import { useCardsStore } from "@/store/cards";
import utilities from "../js/utilities";

const selectedLayout = ref(0);
const confirmDialog = ref({
	show: false,
	title: "",
	message: "",
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	acceptAction: () => {},
});

const cardsStore = useCardsStore();

function selectLayout(value: number) {
	selectedLayout.value = value;
}

onMounted(() => {
	eventBus.on("delete-card", (card) => {
		confirmDialog.value.message = $t(`dialogs.delete${utilities.capitalize(card._category)}`);
		confirmDialog.value.title = `${$t("dialogs.deleteTitle")} "${utilities.getText(card)}" ?`;
		confirmDialog.value.acceptAction = () => cardsStore.deleteCard(card);
		confirmDialog.value.show = true;
	});
});
onBeforeUnmount(() => {
	eventBus.off("delete-card");
});
</script>
