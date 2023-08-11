<template>
	<TagItem :tag="tag" class="drag-image" show-icon />
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { Category, Tag } from "@/core/models";
import { t as $t } from "@/core/translation";
import Icon from "@/core/utils/icons";
import TagItem from "./tags/TagItem.vue";

type Item = Parameters<typeof Tag.from>["0"];

const props = defineProps<{
	items: Item[];
}>();

const tag = computed(() => {
	// If there's only one item, create a tag from the item itself
	if (props.items.length === 1) return Tag.from(props.items[0]);

	// If there's none or multiple items, create a custom tag
	const category = props.items[0]?.category ?? Category.Quest;
	return new Tag(
		"dummy-tag",
		category,
		`${props.items.length} ${$t("actions.multipleDragItems")}`,
		Icon[category]
	);
});
</script>
