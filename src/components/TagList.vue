<template>
	<div class="pa-3">
		<v-row v-for="(list, type) in tags" :key="type">
			<v-icon small>{{icons[type]}}</v-icon>
			<v-chip v-for="tag in list" :key="tag.id" class="ma-1" small outlined @click.stop="goToCard(tag.type, tag.id)">
				{{tag.text | truncate}}
			</v-chip>
		</v-row>
	</div>
</template>

<script>
import { Tag, Objective, Event, Location, Character, Note } from "../js/model.js";
import { eventHub, TagEvent } from "../js/eventHub.js";
import constants from "../js/constants.js";

export default {
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
			icons: constants.icons
		}
	},
	methods: {
		/**
		 * Send an event to the eventHub indicating that a tag referencing a card has been clicked.
		 * This event can be used by layout components to redirect the user to the according card.
		 */
		goToCard(type, id) {
			eventHub.$emit("tag-selected", new TagEvent(type, id));
		},
	},
	computed: {
		/**
		 * Create a Tag for each object whose ID is given
		 */
		tags() {
			let tagsList = {};

			for (const id of this.items) {
				const elem = this.$store.getters.get(id);

				// If the object is found, create a tag object from the element's data
				if (elem) {
					let key = undefined;
					if (elem instanceof Objective) key = constants.objectTypes.OBJECTIVE;
					else if (elem instanceof Event) key = constants.objectTypes.EVENT;
					else if (elem instanceof Location) key = constants.objectTypes.LOCATION;
					else if (elem instanceof Character) key = constants.objectTypes.CHARACTER;
					else if (elem instanceof Note) key = constants.objectTypes.NOTE;
					else {
						console.error(elem, "is not an instance of an accepted object.");
						return;
					}

					// Create a key of the object's type if there is none yet
					if(!(key in tagsList)) tagsList[key] = []

					// Add the tag in the list of its type
					tagsList[key].push(new Tag(elem));
				}
			}
			return tagsList;
		},
	},
	filters: {
		truncate(text) {
			if (text.length > 30) return `${text.substring(0, 30)}...`;
			else return text;
		},
	},
};
</script>

<style></style>
