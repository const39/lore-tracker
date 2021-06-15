<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">
				{{ name }}
				<v-tooltip top v-if="isNPC">
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
			<p class="text--primary">{{ desc }}</p>
		</v-card-text>
	</v-card>
</template>

<script>
import icons from "../../js/icons.js";
import {eventHub, CardEvent} from '../../js/eventHub.js';

import CardOptions from "./CardOptions.vue";

export default {
	name: "CharacterCard",
	components: {
		CardOptions,
	},
	props: {
		id: Number,
		name: String,
		race: String,
		classes: String,
		role: String,
		isNPC: Boolean,
		desc: String,
	},
	data() {
		return {
			icons: icons,
		};
	},
	methods: {
		onOptionSelected(value) {
			eventHub.$emit(value, new CardEvent({type: 'character', id: this.id}))
		},
	},
    computed: {
        identity() {

            let race = this.race || 'Race inconnue';
            let classes = this.classes || 'Classes inconnues';
            let role = this.role || 'Rôle inconnu';

            return `${race} - ${classes} (${role})`;
        }
    }
};
</script>

<style></style>
