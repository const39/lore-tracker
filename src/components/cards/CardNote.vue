<template>
	<BaseCard :outlined="outlined" :id="itemData.id + '-card'">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"/>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ itemData.title }}</p>
			<p class="text--primary">{{ itemData.desc }}</p>
			<TagList :items="itemData.tags"/>
		</v-card-text>
	</BaseCard>
</template>

<script>
import BaseCard from "./BaseCard.vue";
import CardOptions from "./CardOptions.vue";

import { Note } from "../../js/model.js";
import { eventHub, CardEvent } from "../../js/eventHub.js";
import TagList from '../TagList.vue';

export default {
	name: "CardNote",
	components: {
		BaseCard,
		CardOptions,
		TagList,
	},
	props: {
		itemData: {
			type: Note,
			required: true
		},
		outlined: Boolean,
	},
	methods: {
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent('note', this.itemData))
		},
	},
};
</script>

<style></style>
