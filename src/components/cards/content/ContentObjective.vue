<template>
	<!-- Surrounding <div> necessary to avoid "bouncing" effect when transitioning with Form component -->
	<div>
		<v-card-actions class="float-right">
			<v-tooltip top v-if="itemData.isCompleted">
				<template v-slot:activator="{ on, attrs }">
					<v-icon v-bind="attrs" v-on="on">{{ icons.completed }}</v-icon>
				</template>
				<span>{{ $t("fields.completed") }}</span>
			</v-tooltip>
		</v-card-actions>
		<v-card-text class="pa-3">
			<MarkdownView :text="itemData.desc" />
			<TagList :items="itemData.tags" />
		</v-card-text>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Icon, Objective } from "@/js/types";

import TagList from "../tags/TagList.vue";
import MarkdownView from "../../MarkdownView.vue";

export default Vue.extend({
	name: "ContentObjective",
	components: {
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Object as PropType<Objective>,
			required: true,
		},
	},
	data() {
		return {
			icons: Icon,
		};
	},
});
</script>
