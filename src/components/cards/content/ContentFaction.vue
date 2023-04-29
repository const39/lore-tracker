<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<p class="text-h6 mary">
				{{ itemData.name }}
			</p>
			<MarkdownView :text="itemData.desc" />
			<!-- eslint-disable-next-line vue/no-mutating-props - Editable is false so tags is not mutated -->
			<TagList v-model="itemData.tags" :editable="false" />
		</v-card-text>
	</div>
</template>

<script lang="ts" setup>
import MarkdownView from "@/components/common/MarkdownView.vue";
import { Faction } from "@/core/model/cards";
import TagList from "../tags/TagList.vue";

defineProps<{
	itemData: Faction;
}>();
</script>
