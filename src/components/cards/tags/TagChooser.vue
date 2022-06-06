<template>
	<v-autocomplete
		chips
		deletable-chips
		multiple
		:label="$t('fields.tags')"
		v-model="selectedTags"
		:items="availableTags"
		item-text="text"
		item-value="id"
		:menu-props="{'max-width': '30%'}"
		v-bind="$attrs"
	>
		<template v-slot:selection="data">
			<v-chip
				close
				v-bind="data.attrs"
				:input-value="data.selected"
				@click="data.select"
				@click:close="remove(data.item)"
				v-if="overflow ? data.index === 0 : true"
			>
				<v-icon left>{{ data.item.icon }}</v-icon>
				<MarkdownView :text="data.item.text | truncate" :inline="true" />
			</v-chip>
			<span class="grey--text text-caption" v-else-if="overflow && data.index === 1">
				{{ $t("fields.otherCounter") }}
			</span>
		</template>
		<template v-slot:item="data">
			<v-icon left small> {{ data.item.icon }} </v-icon>
			<v-list-item-title>{{data.item.text}}</v-list-item-title>
		</template>
	</v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue';
import utilities from '@/js/utilities';
import { Tag } from "@/js/types";

import MarkdownView from "../../MarkdownView.vue";

export default Vue.extend({
	components: {
		MarkdownView,
	},
	props: {
		// Override default v-model
		value: {
			type: Array,
			required: true,
		},
		excludeId: Number,
		overflow: Boolean,
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
		availableTags(): Tag | {header: string} {
			// TODO simplify algo using new '_category' property
			let tags = [];

			// For each array of objects in the cards store
			for (const key in this.$store.state.cards) {

				// Get the object type constant by removing the 's' of plural from the data key
				const header = key.substring(0, key.length - 1);

				// Push a header object for the v-autocomplete component to create a header for this group of objects
				tags.push({ header: this.$t(`objectTypes.${header}`) });

				// Create an item for each object found in the array
				this.$store.state.cards[key].forEach((element) => {
					// If the current element is not the excluded one
					if (element.id !== this.excludeId) tags.push(new Tag(element));
				});
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
	filters: {
		truncate: (text: string) => utilities.truncate(text, 30),
	},
});
</script>

<style></style>
