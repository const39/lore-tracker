<template>
	<div>
		<v-chip v-for="tag in tags" :key="tag.id" class="ma-1" small>
			<v-icon left>{{ tag.icon }}</v-icon>
			{{ tag.name }}
		</v-chip>
	</div>
</template>

<script>
import storage from "../js/storage.js";
import icons from "../js/icons.js";

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
			icons: icons,
		};
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

					// If the object is found, add a tag object with the object text description (name/title/desc) and the relevant icon
					if (elem) {
						list.push({
							id: elem.id,
							name: elem.name || elem.title || elem.desc,
							icon: icons.whichObjectIcon(elem),
						});
					}
				}
			}
			return list;
		},
	},
};
</script>

<style></style>
