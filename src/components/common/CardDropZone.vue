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
import { Folder, LoreEntry } from "@/core/models";
import { t as $t } from "@/core/translation";

const emit = defineEmits<{
	(e: "drop", value: LoreEntry | Folder): void;
}>();

const refDropZone = ref<HTMLElement | null>(null);

const { status } = useDropZone<LoreEntry | Folder>(refDropZone, "copy", onDropAccepted, {
	acceptMIME: [CustomMIMEType.LoreEntry, CustomMIMEType.Folder],
	acceptMode: ["link"],
});

const color = computed(() => {
	switch (status.value) {
		case "accepted":
			return "primary";
		case "rejected":
			return "error";
		default:
			return "on-surface";
	}
});

/**
 * Callback triggered when the user releases the click (i.e. drops the item) in the drop zone
 */
function onDropAccepted(items: DropPayload<LoreEntry | Folder>[]) {
	if (items.length) {
		const { data } = items[0];
		emit("drop", data);
	}
}
</script>

<style scoped>
.dashed-border {
	border-style: dashed !important;
}
</style>
