<template>
	<v-timeline-item :icon="node.icon" :color="node.color" class="d-flex align-center" :small="node.isHeader" :fill-dot="!node.isHeader">
		<div class="text--primary" :class="{'font-weight-medium': node.isHeader}">{{ node.text }}</div>
	</v-timeline-item>
</template>

<script>
import constants from "../js/constants";
import { Event } from "../js/model";

export default {
	props: {
		item: {
			type: [Event, String],
			required: true,
		},
	},
	computed: {
        /**
         * Return a custom object with the node's data, depending on the item prop type.
         */
		node() {
			let info = {};

            /**
             * If the item prop is an Event, return the relevant Event data.
             * Otherwise, return the prop string in a 'header' field.
             */
			if (this.item instanceof Event) {
				info.text = this.item.desc;
				info.icon = this.item.getIcon();

				switch (this.item.type) {
					case constants.eventTypes.COMBAT:
						info.color = "deep-orange darken-1";
						break;
					case constants.eventTypes.ENCOUNTER:
						info.color = "purple darken-1";
						break;
					case constants.eventTypes.DISCOVERY:
						info.color = "green lighten-1";
						break;
					case constants.eventTypes.TRAVEL:
						info.color = "indigo";
						break;
					default:
						info.color = "grey darken-2";
						break;
				}
			} else {
				info.isHeader = true;
				info.text = this.item;
				info.icon = '';
				info.color = this.$vuetify.theme.dark ? "white" : "black";
			} 

			return info;
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
