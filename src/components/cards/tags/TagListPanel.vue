<template>
	<ListPanel
		:title="$t('pages.loreBook.fields.labels.tags')"
		:is-filled="modelValue.length !== 0"
	>
		<TagList v-model="modelValue" editable />
		<template #append>
			<CardDropZone @drop="onDrop" />
		</template>
	</ListPanel>
</template>

<script lang="ts" setup>
import CardDropZone from "@/components/common/CardDropZone.vue";
import ListPanel from "@/components/common/ListPanel.vue";
import { Indexable } from "@/core/models";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import TagList from "./TagList.vue";

const props = defineProps<{ excludeId?: UUID }>();

const modelValue = defineModel<UUID[]>({ required: true }); // v-model

/**
 * Add the dropped item in the tag list if it is not already in it (or if it is not the excluded ID)
 */
function onDrop(items: Indexable[]) {
	items.forEach((item) => {
		if (!modelValue.value.includes(item.id) && item.id !== props.excludeId) {
			modelValue.value.push(item.id);
		}
	});
}
</script>
