<template>
	<Banner>
		<template #actions>
			<LorebookActions />
		</template>
	</Banner>

	<LayoutTabs />

	<!-- Global delete form for all panels -->
	<ConfirmDialog
		v-model="confirmDialog.show"
		:title="confirmDialog.title"
		:message="confirmDialog.message"
		:accept-action="confirmDialog.acceptAction"
	/>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import LayoutTabs from "@/components/layout/content/LayoutTabs.vue";
import { eventBus } from "@/core/eventBus";
import { getText } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { useCardsStore } from "@/store/cards";

const confirmDialog = ref({
	show: false,
	title: "",
	message: "",
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	acceptAction: () => {},
});

const cardsStore = useCardsStore();

onMounted(() => {
	eventBus.on("delete-card", (card) => {
		confirmDialog.value.message = $t(`dialogs.delete${utilities.capitalize(card._category)}`);
		confirmDialog.value.title = `${$t("dialogs.deleteTitle")} "${getText(card)}" ?`;
		confirmDialog.value.acceptAction = () => cardsStore.deleteCard(card);
		confirmDialog.value.show = true;
	});
});

onBeforeUnmount(() => {
	eventBus.off("delete-card");
});
</script>
