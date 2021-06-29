<template>
	<BaseCard :outlined="outlined" :id="itemData.id + '-card'">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"/>
		</v-card-actions>
		<v-card-text class="pa-3">
			<v-row class="d-flex align-center">
				<v-col class="flex-grow-0 flex-shrink-1 text-center">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon large v-on="on" v-bind="attrs">{{ icons[itemData.type] }}</v-icon>
						</template>
						{{eventTypes[itemData.type]}}
					</v-tooltip>
					<v-chip label x-small outlined>Jour {{ itemData.day }}</v-chip>
				</v-col>
				<v-col class="flex-grow-1 flex-shrink-0">
					<MarkdownView :text="itemData.desc"/>
					<TagList :items="itemData.tags"/>
				</v-col>
			</v-row>
		</v-card-text>
	</BaseCard>
</template>

<script>
import constants from '../../js/constants.js';
import icons from "../../js/icons.js";
import { Event } from '../../js/model.js';
import {eventHub, CardEvent} from '../../js/eventHub.js';

import BaseCard from "./BaseCard.vue";
import CardOptions from "./CardOptions.vue";
import TagList from '../TagList.vue';
import MarkdownView from "../MarkdownView.vue";

export default {
	name: "CardEvent",
	components: {
		CardOptions,
		BaseCard,
		TagList,
		MarkdownView
	},
	props: {
		itemData: {
			type: Event,
			required: true
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
			eventHub.$emit(value, new CardEvent(constants.objectTypes.EVENT, this.itemData));
		},
	},
	computed: {
		eventTypes() {
			let types = {};
			types[constants.eventTypes.COMBAT] = "Combat";
			types[constants.eventTypes.ENCOUNTER] = "Rencontre";
			types[constants.eventTypes.DISCOVERY] = "Découverte";
			types[constants.eventTypes.TRAVEL] = "Voyage";
			types[constants.eventTypes.OTHER] = "Autre";
			return types;
		},
	},
};
</script>
