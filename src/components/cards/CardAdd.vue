<template>
	<div>
		<!-- Dynamic Form component ("Add" version) -->
		<v-expand-transition>
			<BaseCard v-if="showForm">
				<component :is="formComponent" @close="showForm = false" />
			</BaseCard>
		</v-expand-transition>
		<!-- "Add" clickable card button -->
		<v-hover v-if="!showForm" v-slot="{ hover }">
			<v-card outlined class="my-1 custom-border" :class="{ grey: hover, 'lighten-3': !isDarkTheme, 'darken-3': isDarkTheme }">
				<v-card-text class="text-center clickable" icon @click="showForm = true">
					<v-icon>mdi-plus</v-icon>
				</v-card-text>
			</v-card>
		</v-hover>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import BaseCard from "./BaseCard.vue";

import FormObjective from "./forms/FormObjective.vue";
import FormEvent from "./forms/FormEvent.vue";
import FormLocation from "./forms/FormLocation.vue";
import FormCharacter from "./forms/FormCharacter.vue";
import FormNote from "./forms/FormNote.vue";

import utilities from "@/js/utilities";

export default Vue.extend({
	components: {
		BaseCard,
		FormObjective,
		FormEvent,
		FormLocation,
		FormCharacter,
		FormNote,
	},
	props: {
		category: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			showForm: false,
		};
	},
	methods: {

	},
	computed: {
		formComponent(): string {
			return `Form${utilities.capitalize(this.category)}`;
		},
		isDarkTheme(): boolean {
			return this.$vuetify.theme.dark;
		},
	},
});
</script>

<style scoped>
.custom-border {
	border-style: dashed;
}
.clickable:hover {
	cursor: pointer;
}
</style>
