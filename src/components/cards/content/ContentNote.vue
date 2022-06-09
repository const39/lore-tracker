<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ itemData.title }}</p>
			<MarkdownView :text="itemData.desc" />
			<TagList v-model="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import TagList from "../tags/TagList.vue";
import MarkdownView from "../../MarkdownView.vue";

import { Note } from "@/js/types";

export default Vue.extend({
	name: "ContentNote",
	components: {
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Object as PropType<Note>,
			required: true,
		},
	},
});
</script>

<style></style>
