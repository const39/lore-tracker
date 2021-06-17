<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
		</v-card-actions>
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1" v-if="showIcon">
					<v-icon large>{{ icons.whichEventIcon(itemData.type) }}</v-icon>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<p class="text--primary">{{ itemData.desc }}</p>
					<TagList :items="itemData.tags"></TagList>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
import icons from "../../js/icons.js";
import { Event } from '../../js/model.js';
import {eventHub, CardEvent} from '../../js/eventHub.js';

import CardOptions from "./CardOptions.vue";
import TagList from '../TagList.vue';

export default {
	name: "EventCard",
	components: {
		CardOptions,
		TagList
	},
	props: {
		itemData: Event,
		showIcon: Boolean
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
};
</script>
