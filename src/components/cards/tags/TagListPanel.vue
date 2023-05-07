<template>
	<ListPanel :title="$t('fields.tags')" :is-filled="model.length !== 0">
		<TagList v-model="model" editable />
		<template #append>
			<DropZone @drop="onDrop" />
		</template>
	</ListPanel>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import DropZone from "@/components/common/DropZone.vue";
import ListPanel from "@/components/common/ListPanel.vue";
import { CardTypes, ID } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import TagList from "./TagList.vue";

const props = defineProps<{
	modelValue: ID[]; // v-model
	excludeId?: ID;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: ID[]): void;
}>();

// v-model binding
const model = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

/**
 * Add the dropped card in the tag list if it is not already in it (or if it is not the excluded ID)
 */
function onDrop(card: CardTypes) {
	if (!model.value.includes(card.id) && card.id !== props.excludeId) model.value.push(card.id);
}
</script>
