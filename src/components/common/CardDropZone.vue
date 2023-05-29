<template>
	<v-card ref="refDropZone" :color="color" class="ma-2 border dashed-border" variant="outlined">
		<v-card-text class="text-center">
			{{ $t("actions.dropCardHere") }}
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { CustomMIMEType, DropPayload, useDropZone } from "@/composables/dragAndDrop";
import { CardTypes, isCard } from "@/core/model/cards";
import { t as $t } from "@/core/translation";

const emit = defineEmits<{
	(e: "drop", value: CardTypes): void;
}>();

const refDropZone = ref<HTMLElement | null>(null);

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
			return "on-surface"
	}
});

/**
 * Callback triggered when the user releases the click (i.e. drops the item) in the drop zone
 */
function onDropAccepted(items: DropPayload[]) {
	if (items.length) {
		const { dataType, data } = items[0];
		if (dataType === CustomMIMEType.CardType && isCard(data)) {
			emit("drop", data);
		}
	}
}
</script>

<style scoped>
.dashed-border {
	border-style: dashed !important;
}
</style>
