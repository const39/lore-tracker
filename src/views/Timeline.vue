<template>
	<v-container>
		<div class="my-3">
			<div class="text-xl-h4">Frise des événements</div>
			<v-timeline dense class="mx-16 my-6" v-if="nodes.length > 0">
				<TimelineEvent v-for="node in nodes" :key="node.id || node" :item="node" />
			</v-timeline>
			<p class="text-center" v-else>
				Aucun événement enregistré. Vous pouvez en ajouter sur le
				<router-link to="/">Lore Tracker</router-link>.
			</p>
		</div>
	</v-container>
</template>
<script>

import TimelineEvent from "../components/TimelineEvent.vue";

export default {
	components: {
		TimelineEvent,
	},
	computed: {
		nodes() {
			// Get events from store and create a copy of the array to reverse it
			let copy = this.$store.state.cards.events.slice();
			copy.reverse();

			copy.splice(0, 0, "Début de la campagne")
			return copy;
		},
	},
};
</script>

