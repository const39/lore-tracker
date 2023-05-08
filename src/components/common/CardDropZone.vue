<template>
	<v-card ref="refDropZone" :color="color" class="ma-2 border dashed-border" variant="outlined">
		<v-card-text class="text-center">
			{{ $t("actions.dropCardHere") }}
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";
import { useDropZone } from "@/composables/dropZone";
import { CustomMIMEType } from "@/core/constants";
import { CardCategory, CardTypes } from "@/core/model/cards";
import { t as $t } from "@/core/translation";

const emit = defineEmits<{
	(e: "drop", value: CardTypes): void;
}>();

const refDropZone = ref<HTMLElement | null>(null);

const theme = useTheme();
const { status } = useDropZone(refDropZone, "copy", onDropAccepted, {
	acceptMIME: [CustomMIMEType.CardType],
});

const color = computed(() => {
	switch (status.value) {
		case "accepted":
			return "primary";
		case "rejected":
			return "error";
		default:
			return theme.current.value.colors["on-surface"];
	}
});

/**
 * Callback triggered when the user releases the click (i.e. drops the item) in the drop zone
 */
function onDropAccepted(items: Array<File | string | null>) {
	if (items.length) {
		const content = items[0];
		if (typeof content === "string") {
			try {
				// Extract the card data from the DataTransfer
				const maybeCard = JSON.parse(content);
				// Check it is valid card data - If it is, emit event to parent component with the card data
				if (
					"_category" in maybeCard &&
					Object.values(CardCategory).includes(maybeCard._category)
				)
					emit("drop", maybeCard as CardTypes);
			} catch (e) {
				console.error(e);
			}
		}
	}
}
</script>

<style scoped>
.dashed-border {
	border-style: dashed !important;
}
</style>
