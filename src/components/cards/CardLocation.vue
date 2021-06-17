<template>
	<BaseCard :outlined="outlined">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"/>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ itemData.name }}</p>
			<p class="text--primary">{{ itemData.desc }}</p>
			<TagList :items="itemData.tags"/>
		</v-card-text>
	</BaseCard>
</template>

<script>
import BaseCard from "./BaseCard.vue";
import CardOptions from "./CardOptions.vue";
import TagList from '../TagList.vue';

import { Location } from "../../js/model.js";
import {eventHub, CardEvent} from '../../js/eventHub.js';

export default {
	name: "CardLocation",
	components: {
		BaseCard,
		CardOptions,
		TagList,
	},
	props: {
		itemData: {
			type: Location,
			required: true
		},
		outlined: Boolean,
	},
	methods: {
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent('location', this.itemData))
		},
	},
};
</script>
