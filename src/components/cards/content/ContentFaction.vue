<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ itemData.name }}</p>
			<MarkdownView :text="itemData.desc" />
			<TagList :items="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import TagList from "../tags/TagList.vue";
import MarkdownView from "../../MarkdownView.vue";

import { Faction } from "@/js/types";

export default Vue.extend({
	name: "ContentFaction",
	components: {
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Object as PropType<Faction>,
			required: true,
		},
	},
});
</script>
