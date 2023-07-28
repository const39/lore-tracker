<template>
	<v-card-text class="pa-3">
		<p class="text-h6">
			{{ itemData.title }}
		</p>
		<MarkdownView :text="itemData.desc" />
		<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
		<TagList v-model="itemData.tags" :editable="false" />
	</v-card-text>
</template>

<script lang="ts" setup>
import TagList from "@/components/cards/tags/TagList.vue";
import MarkdownView from "@/components/common/MarkdownView.vue";
import { Note } from "@/core/models";

defineProps<{
	itemData: Note;
}>();
</script>
