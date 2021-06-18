<template>
	<BaseCard :outlined="outlined">
		<v-card-actions class="float-right">
			<v-tooltip top v-if="itemData.isCompleted">
				<template v-slot:activator="{ on, attrs }">
					<v-icon v-bind="attrs" v-on="on">{{ icons.completed }}</v-icon>
				</template>
				<span>Accompli</span>
			</v-tooltip>
			<CardOptions @option-selected="onOptionSelected" />
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text--primary">{{ itemData.desc }}</p>
			<TagList :items="itemData.tags" />
		</v-card-text>
	</BaseCard>
</template>

<script>
import icons from "../../js/icons.js";
import { Objective } from "../../js/model.js";
import { eventHub, CardEvent } from "../../js/eventHub.js";

import BaseCard from "./BaseCard.vue";
import CardOptions from "./CardOptions.vue";
import TagList from "../TagList.vue";

export default {
	name: "CardObjective",
	components: {
		BaseCard,
		CardOptions,
		TagList,
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
			icons: icons,
		};
	},
	methods: {
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent("objective", this.itemData));
		},
	},
};
</script>
