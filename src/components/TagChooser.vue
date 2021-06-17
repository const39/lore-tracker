<template>
	<v-autocomplete
		chips
		deletable-chips
		multiple
		label="Liens"
		v-model="selectedTags"
		:items="availableTags"
		item-text="name"
		item-value="id"
	>
		<template v-slot:selection="data">
			<v-chip
				close
				v-bind="data.attrs"
				:input-value="data.selected"
				@click="data.select"
				@click:close="remove(data.item)"
			>
				<v-icon left>{{ data.item.icon }}</v-icon>
				{{ data.item.name }}
			</v-chip>
		</template>
		<template v-slot:item="data">
			<v-list-item-avatar>
				<v-icon left> {{ data.item.icon }} </v-icon>
			</v-list-item-avatar>
			<v-list-item-content>
				<v-list-item-title v-html="data.item.name"></v-list-item-title>
			</v-list-item-content>
		</template>
	</v-autocomplete>
</template>

<script>
import storage from "../js/storage.js";
import icons from "../js/icons.js";

export default {
	props: {
		// Override default v-model
		value: {
			type: Array,
			required: true,
		},
		excludeType: String,
	},
	methods: {
		remove(item) {
			const index = this.selectedTags.indexOf(item.id);
			if (index >= 0) this.selectedTags.splice(index, 1);
		},
	},
	computed: {
		/**
		 * Browse the store to create a tag for each object (excluding the specified object type, if given)
		 */
		availableTags() {
			let tags = [];

			// For each array of objects in storage
			for (const key in storage.data) {
				// Compute the object type automatically by removing the 's' of plural on each key
				let type = key.substr(0, key.length - 1);

				// If the current array is not the excluded one
				if (type !== this.excludeType) {

					// Push a header object for the v-autocomplete component to create a header for this group of objects
					tags.push({ header: key });

					// Create an item for each object found in the array
					storage.data[key].forEach((element) => {

						tags.push({
							id: element.id,
							name: element.name || element.title || element.desc,
							type: type,
							icon: icons.whichObjectIcon(element),
						});
					});
				}
			}

			return tags;
		},
		/**
		 * Overwrite default v-model to bind the TagChooser v-model attribute to the v-autocomplete one.
		 * This allows the parent component to get a 2-way data bind to the v-autocomplete seamlessly
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		selectedTags: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			},
		},
	},
};
</script>

<style></style>
