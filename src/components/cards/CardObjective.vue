<template>
	<BaseCard :outlined="outlined" :id="itemData.id + '-card'">
		<v-card-actions class="float-right">
			<v-tooltip top v-if="itemData.isCompleted">
				<template v-slot:activator="{ on, attrs }">
					<v-icon v-bind="attrs" v-on="on">{{ icons.completed }}</v-icon>
				</template>
				<span>{{ $t("fields.completed") }}</span>
			</v-tooltip>
			<CardOptions @option-selected="onOptionSelected" />
		</v-card-actions>
		<v-card-text class="pa-3">
			<MarkdownView :text="itemData.desc" />
			<TagList :items="itemData.tags" />
		</v-card-text>
	</BaseCard>
</template>

<script>
import constants from "../../js/constants.js";
import { Objective } from "../../js/model.js";
import { eventHub, CardEvent } from "../../js/eventHub.js";

import BaseCard from "./BaseCard.vue";
import CardOptions from "./CardOptions.vue";
import TagList from "../TagList.vue";
import MarkdownView from "../MarkdownView.vue";

export default {
	name: "CardObjective",
	components: {
		BaseCard,
		CardOptions,
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Objective,
			required: true,
		},
		outlined: Boolean,
	},
	data() {
		return {
			icons: constants.icons,
		};
	},
	methods: {
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent(constants.objectTypes.OBJECTIVE, this.itemData));
		},
	},
};
</script>
