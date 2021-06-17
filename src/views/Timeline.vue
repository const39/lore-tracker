<template>
	<v-container>
		<div class="my-3">
			<div class="text-xl-h4">Frise des événements</div>
			<v-timeline v-if="liveData.events.length > 0">
				<v-timeline-item
					v-for="event in liveData.events"
					:key="event.id"
					:icon="icons.whichEventIcon(event.type)"
					:color="computeColor(event.type)"
					fill-dot
				>
					<CardEvent :item-data="event" :show-icon="false" />
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
import storage from "../js/storage.js";
import icons from "../js/icons.js";

import CardEvent from "../components/cards/CardEvent.vue";

export default {
	components: {
		CardEvent,
	},
	data() {
		return {
			liveData: storage.data,
			icons: icons,
		};
	},
	methods: {
		computeColor(eventType) {
			if (eventType) {
				switch (eventType.toLowerCase()) {
					case "combat":
						return "deep-orange darken-1";
					case "encounter":
						return "purple darken-1";
					case "discovery":
						return "green lighten-1";
					case "travel":
						return "indigo";
					default:
						return "grey darken-2";
				}
			} else return "grey darken-2";
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
