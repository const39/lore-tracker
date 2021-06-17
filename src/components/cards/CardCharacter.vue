<template>
	<BaseCard :outlined="outlined">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"/>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">
				{{ itemData.name }}
				<v-tooltip top v-if="itemData.isNPC">
					<template v-slot:activator="{ on, attrs }">
						<v-icon v-bind="attrs" v-on="on">{{ icons.npc }}</v-icon>
					</template>
					<span>PNJ</span>
				</v-tooltip>
				<v-tooltip top v-else>
					<template v-slot:activator="{ on, attrs }">
						<v-icon v-bind="attrs" v-on="on">{{ icons.player }}</v-icon>
					</template>
					<span>Joueur</span>
				</v-tooltip>
			</p>
			<p class="text-subtitle-2 text--primary">{{ identity }}</p>
			<p class="text--primary">{{ itemData.desc }}</p>
			<TagList :items="itemData.tags"/>
		</v-card-text>
	</BaseCard>
</template>

<script>
import icons from "../../js/icons.js";
import { Character } from '../../js/model.js';
import {eventHub, CardEvent} from '../../js/eventHub.js';

import BaseCard from "./BaseCard.vue";
import CardOptions from "./CardOptions.vue";
import TagList from '../TagList.vue';

export default {
	name: "CardCharacter",
	components: {
		BaseCard,
		CardOptions,
		TagList,
	},
	props: {
		itemData: {
			type: Character,
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
			eventHub.$emit(value, new CardEvent('character', this.itemData))
		},
	},
    computed: {
        identity() {

            let race = this.itemData.race || 'Race inconnue';
            let classes = this.itemData.classes || 'Classe inconnue';
            let role = this.itemData.role || 'Rôle inconnu';

            return `${race} - ${classes} (${role})`;
        }
    }
};
</script>
