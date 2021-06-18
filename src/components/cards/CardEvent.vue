<template>
	<BaseCard :outlined="outlined">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"/>
		</v-card-actions>
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1" v-if="!hideIcon">
					<v-icon large>{{ icons.whichEventIcon(itemData.type) }}</v-icon>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<p class="text--primary">{{ itemData.desc }}</p>
					<TagList :items="itemData.tags"/>
				</v-col>
			</v-row>
		</v-card-text>
	</BaseCard>
</template>

<script>
import icons from "../../js/icons.js";
import { Event } from '../../js/model.js';
import {eventHub, CardEvent} from '../../js/eventHub.js';

import BaseCard from "./BaseCard.vue";
import CardOptions from "./CardOptions.vue";
import TagList from '../TagList.vue';

export default {
	name: "CardEvent",
	components: {
		CardOptions,
		BaseCard,
		TagList
	},
	props: {
		itemData: {
			type: Event,
			required: true
		},
		outlined: Boolean,
		hideIcon: Boolean,
	},
	data() {
		return {
			icons: icons,
		};
	},
	methods: {
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent('event', this.itemData))
		},
	},
	computed: {

	}
};
</script>
