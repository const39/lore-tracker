<template>
	<v-container>
		<div class="my-3">
			<div class="text-xl-h4">Frise des événements</div>
			<v-timeline v-if="events.length > 0">
				<v-timeline-item
					v-for="event in events"
					:key="event.id"
					:icon="icons[event.type]"
					:color="computeColor(event.type)"
					fill-dot
				>
					<CardEvent :item-data="event" :hide-icon="true" />
				</v-timeline-item>
			</v-timeline>
			<p class="text-center" v-else>
				Aucun événement enregistré. Vous pouvez en ajouter sur le
				<router-link to="/">Lore Tracker</router-link>.
			</p>
		</div>
	</v-container>
</template>
<script>
import constants from "../js/constants.js";
import icons from "../js/icons.js";

import CardEvent from "../components/cards/CardEvent.vue";

export default {
	components: {
		CardEvent,
	},
	data() {
		return {
			icons: icons,
		};
	},
	methods: {
		computeColor(eventType) {
			switch (eventType) {
				case constants.eventTypes.COMBAT:
					return "deep-orange darken-1";
				case constants.eventTypes.ENCOUNTER:
					return "purple darken-1";
				case constants.eventTypes.DISCOVERY:
					return "green lighten-1";
				case constants.eventTypes.TRAVEL:
					return "indigo";
				default:
					return "grey darken-2";
			}
		},
	},
	computed: {
		events() {
			// Get events from store and create a copy of the array to reverse it
			let copy = this.$store.state.data.events.slice();
			return copy.reverse();
		},
	},
};
</script>

<style>
/* Set zoom on hover animation on the compiled Vuetify class of the dot */
.v-timeline-item__dot:hover {
	animation: zoom-on-hover 0.1s ease-in 1;
	transform: scale(1.25);
}

@keyframes zoom-on-hover {
	0% {
		transform: scale(1);
	}
	100% {
		transform: scale(1.25);
	}
}
</style>
