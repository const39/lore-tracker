<template>
	<div class="pa-3">
		<v-row v-for="(list, category) in tags" :key="category">
			<v-icon small>{{ icons[category] }}</v-icon>
			<!-- Editable version -->
			<div v-if="editable">
				<v-chip v-for="tag in list" :key="tag.id" class="ma-1" small outlined close @click:close="remove(tag)">
					{{ tag.text | truncate }}
				</v-chip>
			</div>
			<!-- Immutable version -->
			<dir v-else>
				<v-chip v-for="tag in list" :key="tag.id" class="ma-1" small outlined @click.stop="goToCard(tag)">
					{{ tag.text | truncate }}
				</v-chip>
			</dir>
		</v-row>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Tag, Icon, ID } from "@/js/types";
import { eventHub, TagEvent } from "@/js/eventHub";
import utilities from "@/js/utilities";

export default Vue.extend({
	props: {
		// Override default v-model
		value: {
			// Must be an array of IDs
			type: Array as PropType<ID[]>,
			default: () => {
				return [];
			},
		},
		editable: Boolean,
	},
	methods: {
		/**
		 * Remove the ID matching the specified Tag from the 'value' prop (if any).
		 * Performs in-place removal, the prop is changed directly.
		 */
		remove(tag: Tag) {
			const index = this.value.indexOf(tag.id);
			if (index >= 0) this.value.splice(index, 1);
		},
		/**
		 * Send an event to the eventHub indicating that a tag referencing a card has been clicked.
		 * This event can be used by layout components to redirect the user to the according card.
		 */
		goToCard(tag: Tag) {
			eventHub.$emit(TagEvent.ID, new TagEvent(tag));
		},
	},
	computed: {
		icons() {
			return Icon;
		},
		/**
		 * Create a Tag for each object whose ID is given
		 */
		tags() {
			let tagsList: any = {};

			for (const id of this.value) {
				const elem = this.$store.getters.getById(id);

				// If the object is found, create a tag object from the element's data
				if (elem) {
					let key = elem._category;

					// Create a key of the object's type if there is none yet
					if (!(key in tagsList)) tagsList[key] = [];

					// Add the tag in the list of its type
					tagsList[key].push(new Tag(elem));
				} else console.error(`TagList: No card with id ${id} found.`);
			}
			return tagsList;
		},
	},
	filters: {
		truncate: (text: string) => utilities.truncate(text, 30),
	},
});
</script>

<style></style>
