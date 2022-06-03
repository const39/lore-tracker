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

<script>
import constants from "../../../js/constants.js";
import { Objective } from "../../../js/model.js";

import TagList from "../tags/TagList.vue";
import MarkdownView from "../../MarkdownView.vue";

export default {
	name: "ContentObjective",
	components: {
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Objective,
			required: true,
		},
	},
	data() {
		return {
			icons: constants.icons,
		};
	},
};
</script>
