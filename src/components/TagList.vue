<template>
	<div>
		<v-chip v-for="tag in tags" :key="tag.id" class="ma-1" small @click.stop="goToCard(tag.type, tag.id)">
			<v-icon left>{{ tag.icon }}</v-icon>
			<MarkdownView class="text-truncate" :text="tag.text | truncate" :inline="true"/>
		</v-chip>
	</div>
</template>

<script>
import { Tag } from "../js/model.js";
import { eventHub, TagEvent } from '../js/eventHub.js';

import MarkdownView from "./MarkdownView.vue";

export default {
	components: {
		MarkdownView
	},
	props: {
		items: {
			// Must be an array of IDs
			type: Array,
			default: function() {
				return [];
			},
		},
	},
	methods: {
		/**
		 * Send an event to the eventHub indicating that a tag referencing a card has been clicked.
		 * This event can be used by layout components to redirect the user to the according card.
		 */
		goToCard(type, id) {
			eventHub.$emit('tag-selected', new TagEvent(type, id));
		}
	},
	computed: {
		/**
		 * Create a Tag for each object whose ID is given
		 */
		tags() {
			let tagsList = [];
			for (const id of this.items) {

				// For each array of objects in data
				for (const key in this.$store.state.data) {

					// Check if the current id references an object in it
					let elem = this.$store.state.data[key].find((entry) => entry.id === id);

					// If the object is found, create a tag object from the element's data
					if (elem) tagsList.push(new Tag(elem));
				}
			}
			return tagsList;
		},
	},
	filters: {
		truncate(text) {
			if(text.length > 30) return `${text.substring(0, 30)}...`
			else return text;
		}
	}
};
</script>

<style></style>
