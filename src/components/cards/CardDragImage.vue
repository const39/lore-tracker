<template>
	<TagItem :tag="tag" class="drag-image" show-icon />
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { Folder, LoreEntry, Tag } from "@/core/models";
import TagItem from "./tags/TagItem.vue";

const props = defineProps<{
	itemData: LoreEntry | Folder;
}>();

const tag = computed(() => Tag.from(props.itemData));
</script>
