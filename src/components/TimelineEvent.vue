<template>
	<v-timeline-item :icon="node.icon" :color="node.color" class="d-flex align-center" :small="node.isHeader" :fill-dot="!node.isHeader">
		<div class="text--primary" :class="{'font-weight-medium': node.isHeader}">{{ node.text }}</div>
	</v-timeline-item>
</template>

<script lang="ts">
import Vue from "vue";
import { EventType, CardCategory } from "@/js/types";
import utilities from '@/js/utilities';

interface Node {
	isHeader: boolean,
	text: string,
	icon: string,
	color: string,
}

export default Vue.extend({
	props: {
		item: {
			// 'type' should be 'Event | string' but TypeScript and Vue type-check systems conflict, so no restriction enforced until migration to Vue3
			type: [String, Object],
			required: true,
		},
	},
	computed: {
        /**
         * Return a custom object with the node's data, depending on the item prop type.
         */
		node() {
			let info = {} as Node;

            /**
             * If the item prop is an Event, return the relevant Event data.
             * Otherwise, return the prop string in a 'header' field.
             */
			if(typeof this.item === "string") {

				info.isHeader = true;
				info.text = this.item;
				info.icon = '';
				info.color = this.$vuetify.theme.dark ? "white" : "black";

			} else if (this.item._category === CardCategory.Event) {

				info.text = this.item.desc;
				info.icon = utilities.getIcon(this.item);

				switch (this.item.type) {
					case EventType.COMBAT:
						info.color = "deep-orange darken-1";
						break;
					case EventType.ENCOUNTER:
						info.color = "purple darken-1";
						break;
					case EventType.DISCOVERY:
						info.color = "green lighten-1";
						break;
					case EventType.TRAVEL:
						info.color = "indigo";
						break;
					default:
						info.color = "grey darken-2";
						break;
				}
			}

			return info;
		},
	},
});
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
