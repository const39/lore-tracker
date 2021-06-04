<template>
	<v-container>
		<v-timeline>
			<v-timeline-item v-for="event in data.events" :key="event.id" :icon="icon(event.type)" fill-dot>
				<v-card class="elevation-2">
					<v-card-title class="text-subtitle-2"> {{"title"}} </v-card-title>
					<v-card-text> {{event.desc}} </v-card-text>
				</v-card>
			</v-timeline-item>
		</v-timeline>
	</v-container>
</template>
<script>
import storage from "../js/storage.js";

export default {
	data() {
		return {
			data: storage.testData
		}
	},
	methods: {
		icon(eventType) {
			if(eventType.toLowerCase() == 'combat')
				return 'mdi-sword-cross';
			else if(eventType.toLowerCase() == 'encounter')
				return 'mdi-account-group';
			else if(eventType.toLowerCase() == 'discovery')
				return 'mdi-magnify';
			else if(eventType.toLowerCase() == 'travel')
				return 'mdi-horseshoe';
			else 
				return '';
		}
	}
}
</script>

<style>

</style>