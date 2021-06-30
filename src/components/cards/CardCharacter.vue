<template>
	<BaseCard :outlined="outlined" :id="itemData.id + '-card'">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected" />
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">
				{{ itemData.name }}
				<v-tooltip top v-if="!itemData.isAlive">
					<template v-slot:activator="{ on, attrs }">
						<v-icon v-bind="attrs" v-on="on">mdi-skull</v-icon>
					</template>
					<span>{{ $t("fields.dead") }}</span>
				</v-tooltip>
				<v-chip label x-small> {{ itemData.isNPC ? $t("fields.npc") : $t("fields.player") }} </v-chip>
			</p>
			<p class="text-subtitle-2 text--primary text-truncate">{{ identity }}</p>
			<MarkdownView :text="itemData.desc" />
			<TagList :items="itemData.tags" />
		</v-card-text>
	</BaseCard>
</template>

<script>
import constants from "../../js/constants.js";
import icons from "../../js/icons.js";
import { Character } from "../../js/model.js";
import { eventHub, CardEvent } from "../../js/eventHub.js";

import BaseCard from "./BaseCard.vue";
import CardOptions from "./CardOptions.vue";
import TagList from "../TagList.vue";
import MarkdownView from "../MarkdownView.vue";

export default {
	name: "CardCharacter",
	components: {
		BaseCard,
		CardOptions,
		TagList,
		MarkdownView,
	},
	props: {
		itemData: {
			type: Character,
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
			eventHub.$emit(value, new CardEvent(constants.objectTypes.CHARACTER, this.itemData));
		},
	},
	computed: {
		identity() {
			let race = this.itemData.race || this.$t("fields.unknownRace");
			let classes = this.itemData.classes || this.$t("fields.unknownClass");
			let role = this.itemData.role || this.$t("fields.unknownRole");

			return `${race} - ${classes} (${role})`;
		},
	},
};
</script>
