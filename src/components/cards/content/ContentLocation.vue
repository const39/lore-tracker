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

<script>
import TagList from "../../TagList.vue";
import MarkdownView from "../../MarkdownView.vue";

import { Location } from "../../../js/model.js";

export default {
	name: "ContentLocation",
	components: {
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Location,
			required: true,
		},
	},
};
</script>
