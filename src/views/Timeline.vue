<template>
	<v-container>
		<v-timeline>
			<v-timeline-item
				v-for="event in liveData.events"
				:key="event.id"
				:icon="icons.whichEventIcon(event.type)"
				fill-dot
			>
				<v-card class="elevation-2">
					<v-card-title class="text-subtitle-2"> {{ "title" }} </v-card-title>
					<v-card-text> {{ event.desc }} </v-card-text>
				</v-card>
			</v-timeline-item>
		</v-timeline>
	</v-container>
</template>
<script>
import storage from "../js/storage.js";
import icons from "../js/icons.js";

export default {
	data() {
		return {
			liveData: storage.data,
			icons: icons,
		};
	},
};
</script>

<style>
/* Set zoom on hover animation on the compiled Vuetify class of the dot */
.v-timeline-item__dot:hover {
	animation-name: zoom-on-hover;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.1s;
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
