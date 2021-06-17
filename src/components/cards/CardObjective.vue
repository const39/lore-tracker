<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"/>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text--primary">
				<v-tooltip top v-if="itemData.isCompleted">
					<template v-slot:activator="{ on, attrs }">
						<v-icon v-bind="attrs" v-on="on">{{ icons.completed }}</v-icon>
					</template>
					<span>Accompli</span>
				</v-tooltip>
				{{ itemData.desc }}
			</p>
			<TagList :items="itemData.tags"/>
		</v-card-text>
	</v-card>
</template>

<script>
import icons from "../../js/icons.js";
import { Objective } from "../../js/model.js";
import { eventHub, CardEvent } from "../../js/eventHub.js";

import CardOptions from "./CardOptions.vue";
import TagList from "../TagList.vue";

export default {
	name: "CardObjective",
	components: {
		CardOptions,
		TagList,
	},
	props: {
		itemData: Objective,
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
