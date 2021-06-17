<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ itemData.title }}</p>
			<p class="text--primary">{{ itemData.desc }}</p>
			<TagList :items="itemData.tags"></TagList>
		</v-card-text>
	</v-card>
</template>

<script>
import CardOptions from "./CardOptions.vue";

import { Note } from "../../js/model.js";
import { eventHub, CardEvent } from "../../js/eventHub.js";
import TagList from '../TagList.vue';

export default {
	name: "NoteCard",
	components: {
		CardOptions,
		TagList,
	},
	props: {
		itemData: Note,
	},
	methods: {
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent('note', this.itemData))
		},
	},
};
</script>

<style></style>
