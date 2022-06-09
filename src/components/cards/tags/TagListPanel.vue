<template>
	<ListPanel :title="$t('fields.tags')" :empty-content-text="$t('fields.noTag')" :is-filled="model.length !== 0">
		<template v-slot:action>
			<v-slide-x-reverse-transition>
				<v-btn v-if="!showAutocomplete" icon @click="showAutocomplete = true">
					<v-icon>mdi-plus</v-icon>
				</v-btn>
				<TagAutocomplete v-else v-model="showAutocomplete" :excludeIds="excludeIds" @select="onSelection" />
			</v-slide-x-reverse-transition>
		</template>
		<TagList v-model="model" editable />
	</ListPanel>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { ID } from "@/js/types";

import ListPanel from "@/components/ListPanel.vue";
import TagList from "./TagList.vue";
import TagAutocomplete from "./TagAutocomplete.vue";

export default Vue.extend({
	components: {
		ListPanel,
		TagList,
		TagAutocomplete,
	},
	props: {
		// Override default v-model
		value: {
			type: Array as PropType<ID[]>,
			required: true,
		},
		excludeId: Number as PropType<ID>,
	},
	data() {
		return {
			showAutocomplete: false,
		};
	},
	methods: {
		onSelection(id: ID) {
			if (!this.model.includes(id)) this.model.push(id);
		},
	},
	computed: {
		/**
		 * Overwrite default v-model to bind the v-model attribute to the parent.
		 * This allows the parent component to get a 2-way data bind to this component seamlessly.
		 * In this case, it allows the TagListPanel > TagList > TagAutocomplete component chain to propagate any data update to the parent/child components.
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		model: {
			get(): ID[] {
				return this.value;
			},
			set(value: ID[]) {
				this.$emit("input", value);
			},
		},
		excludeIds() {
			return [this.excludeId, ...this.model];
		},
	},
});
</script>
