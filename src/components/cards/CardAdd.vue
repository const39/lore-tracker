<template>
	<div :class="{ 'fill-height': fillHeight }">
		<v-expand-transition>
			<!-- Dynamic Form component ("Add" version) -->
			<BaseCard v-if="showForm">
				<component :is="formComponent" :category="category" @close="closeForm" />
			</BaseCard>
		</v-expand-transition>
		<v-fade-transition>
			<!-- "Add" clickable card button -->
			<v-card
				v-if="showAdd"
				outlined
				@mouseenter="hover = true"
				@mouseleave="hover = false"
				class="my-1 custom-border"
				:class="{ 'fill-height': fillHeight, grey: hover, 'lighten-3': !isDarkTheme, 'darken-3': isDarkTheme }"
			>
				<v-card-text class="text-center clickable" :class="{ 'fill-height': fillHeight }" @click="openForm">
					<v-icon large>mdi-plus</v-icon>
				</v-card-text>
			</v-card>
		</v-fade-transition>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import BaseCard from "./BaseCard.vue";

import FormQuest from "./forms/FormQuest.vue";
import FormEvent from "./forms/FormEvent.vue";
import FormLocation from "./forms/FormLocation.vue";
import FormCharacter from "./forms/FormCharacter.vue";
import FormFaction from "./forms/FormFaction.vue";
import FormNote from "./forms/FormNote.vue";

import utilities from "@/js/utilities";

export default Vue.extend({
	components: {
		BaseCard,
		FormQuest,
		FormEvent,
		FormLocation,
		FormCharacter,
		FormFaction,
		FormNote,
	},
	props: {
		category: {
			type: String,
			required: true,
		},
		fillHeight: Boolean, // Optional style prop
	},
	data() {
		return {
			showForm: false,
			showAdd: true,
			hover: false,
		};
	},
	methods: {
		openForm(): void {
			this.showForm = true;
			this.showAdd = false;
		},
		closeForm(): void {
			this.showForm = false;
			// HACK: Delay display of 'Add' clickable card to after the form transition completion
			setTimeout(() => (this.showAdd = true), 300);
		},
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
.clickable {
	display: flex;
	align-items: center;
	justify-content: center;
}
.clickable:hover {
	cursor: pointer;
}
</style>
