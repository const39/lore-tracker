<template>
	<div>
		<v-chip v-for="tag in tags" :key="tag.id" class="ma-1" small @click.stop="goToCard(tag.type, tag.id)">
			<v-icon left>{{ tag.icon }}</v-icon>
			<MarkdownView class="text-truncate" :text="tag.name | truncate" :inline="true"/>
		</v-chip>
	</div>
</template>

<script>
import storage from "../js/storage.js";
import icons from "../js/icons.js";
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
	data() {
		return {
			icons: icons,
		};
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
		 * Get info of each object whose ID is given
		 */
		tags() {
			let list = [];

			for (const id of this.items) {
				// For each array of objects in storage
				for (const key in storage.data) {
					// Check if the current id references an object in it
					let elem = storage.data[key].find((entry) => entry.id === id);

					// Compute the object type automatically by removing the 's' of plural on each key
					let type = key.substr(0, key.length - 1);

					// If the object is found, add a tag object with the object text description (name/title/desc) and the relevant icon
					if (elem) {
						list.push({
							id: elem.id,
							name: elem.name || elem.title || elem.desc,
							icon: icons.whichObjectIcon(elem),
							type: type
						});
					}
				}
			}
			return list;
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
