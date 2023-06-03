<template>
	<TagItem :tag="tag" class="drag-image" show-icon />
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { CardFolder, CardTypes, Tag } from "@/core/model/cards";
import TagItem from "./tags/TagItem.vue";

const props = defineProps<{
	itemData: CardTypes | CardFolder;
}>();

const tag = computed(() => new Tag(props.itemData));
</script>
