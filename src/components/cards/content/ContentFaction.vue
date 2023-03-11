<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ itemData.name }}</p>
			<MarkdownView :text="itemData.desc" />
			<TagList v-model="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script lang="ts" setup>
import MarkdownView from "../../MarkdownView.vue";
import TagList from "../tags/TagList.vue";

import { Faction } from "@/js/types";

defineProps<{
	itemData: Faction;
}>();
</script>
