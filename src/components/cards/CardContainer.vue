<template>
	<BaseCard :with-options="!showForm" :outlined="outlined" @edit="showForm = true" @delete="onDelete">
		<v-expand-transition>
			<!-- Dynamic Form component -->
			<component v-if="showForm" :is="formComponent" :edit="itemData.id" @close="showForm = false" />
			<!-- Dynamic Card content component -->
			<component v-else :is="contentComponent" :class="{ draggable: !isSortDisabled }" :item-data="itemData" />
		</v-expand-transition>
	</BaseCard>
</template>

<script>
import { Character, Event, Location, Note, Objective } from "../../js/model";

import BaseCard from "./BaseCard.vue";

import ContentObjective from "./content/ContentObjective.vue";
import ContentEvent from "./content/ContentEvent.vue";
import ContentLocation from "./content/ContentLocation.vue";
import ContentCharacter from "./content/ContentCharacter.vue";
import ContentNote from "./content/ContentNote.vue";

import FormObjective from "./forms/FormObjective.vue";
import FormEvent from "./forms/FormEvent.vue";
import FormLocation from "./forms/FormLocation.vue";
import FormCharacter from "./forms/FormCharacter.vue";
import FormNote from "./forms/FormNote.vue";

export default {
	components: {
		BaseCard,
		FormObjective,
		FormEvent,
		FormLocation,
		FormCharacter,
		FormNote,
		ContentObjective,
		ContentEvent,
		ContentLocation,
		ContentCharacter,
		ContentNote,
	},
	props: {
		itemData: {
			type: [Character, Event, Location, Note, Objective],
			required: true,
		},
		outlined: Boolean,
	},
	data() {
		return {
			showForm: false,
			showContent: true,
		};
	},
	methods: {
		// TODO manage 'delete' event
		onDelete() {
			// eventHub.$emit('delete', new CardEvent(######, this.itemData));
		},
	},
	computed: {
		contentComponent() {
			return `Content${this.itemData.constructor.name}`;
		},
		formComponent() {
			return `Form${this.itemData.constructor.name}`;
		},
		isSortDisabled() {
			return this.$store.state.filter.isEnabled;
		},
	},
};
</script>

<style></style>
