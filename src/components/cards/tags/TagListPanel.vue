<template>
	<ListPanel :title="$t('fields.tags')" :is-filled="model.length !== 0">
		<TagList v-model="model" editable />
		<template #append>
			<CardDropZone @drop="onDrop" />
		</template>
	</ListPanel>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import CardDropZone from "@/components/common/CardDropZone.vue";
import ListPanel from "@/components/common/ListPanel.vue";
import { Indexable } from "@/core/models";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import TagList from "./TagList.vue";

const props = defineProps<{
	modelValue: UUID[]; // v-model
	excludeId?: UUID;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: UUID[]): void;
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
 * Add the dropped item in the tag list if it is not already in it (or if it is not the excluded ID)
 */
function onDrop(items: Indexable[]) {
	items.forEach((item) => {
		if (!model.value.includes(item.id) && item.id !== props.excludeId) {
			model.value.push(item.id);
		}
	});
}
</script>
