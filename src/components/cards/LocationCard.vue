<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ name }}</p>
			<p class="text--primary">{{ desc }}</p>
		</v-card-text>
	</v-card>
</template>

<script>
import CardOptions from "./CardOptions.vue";

import {eventHub, CardEvent} from '../../js/eventHub.js';

export default {
	name: "LocationCard",
	components: {
		CardOptions,
	},
	props: {
		id: Number,
		name: String,
		desc: String,
	},
	methods: {
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent({type: 'location', id: this.id}))
		},
	},
};
</script>

<style></style>
