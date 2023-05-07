<template>
	<v-card class="ma-2 custom-border" variant="outlined" @dragover="onDragOver" @drop="onDrop">
		<v-card-text class="text-center">
			{{ $t("actions.dropCardHere") }}
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
import { CardCategory, CardTypes } from "@/core/model/cards";
import { t as $t } from "@/core/translation";

const emit = defineEmits<{
	(e: "drop", value: CardTypes): void;
}>();

/**
 * Callback triggered when the cursor is hovering above the drop zone
 */
function onDragOver(e: DragEvent) {
	e.preventDefault();
	if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
}

/**
 * Callback triggered when the user releases the click (i.e. drops the item) in the drop zone
 */
function onDrop(e: DragEvent) {
	e.preventDefault();
	try {
		// Extract the card data from the DataTransfer
		const maybeCard = JSON.parse(e.dataTransfer?.getData("application/card-type") ?? "");
		// Check it is valid card data - If it is, emit event to parent component with the card data
		if ("_category" in maybeCard && Object.values(CardCategory).includes(maybeCard._category))
			emit("drop", maybeCard as CardTypes);
	} catch (e) {
		console.error(e);
	}
}
</script>

<style scoped>
.custom-border {
	border: 1px dashed lightgray;
}
</style>
