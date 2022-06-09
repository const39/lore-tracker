<template>
	<v-autocomplete
		v-model="selectedTag"
		:items="availableTags"
		item-text="text"
		item-value="id"
		dense
		:menu-props="{ 'max-width': '30%' }"
		append-outer-icon="mdi-chevron-right"
		@change="onChange"
		@click:append-outer="open = false"
	>
		<template v-slot:prepend>
			<v-menu bottom left>
				<template v-slot:activator="{ on: menu, attrs }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">{{ icons[category] }}</v-icon>
						</template>
						<span>{{$t('actions.changeCategory')}}</span>
					</v-tooltip>
				</template>
				<v-list dense>
					<v-list-item-group>
						<v-list-item v-for="cat in categories" :key="cat" link @click="category = cat">
							<v-list-item-title>
								<v-icon small class="mx-1">{{ icons[cat] }}</v-icon>
								{{ $t(`categories.${cat}`) }}
							</v-list-item-title>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-menu>
		</template>
	</v-autocomplete>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { CardCategory, CardTypes, Icon, ID, Tag } from "@/js/types";

export default Vue.extend({
	props: {
		// Override default v-model
		value: {
			type: Boolean,
			required: true,
		},
		excludeIds: Array as PropType<ID[]>,
	},
	data() {
		return {
			category: CardCategory.Quest,
			selectedTag: undefined,
		};
	},
	methods: {
		onChange(value: ID) {
			if (value) {
				this.$emit("select", value);
				// HACK: Reset selection when removing the last selected tag
				this.$nextTick(() => {
					this.selectedTag = undefined;
				});
			}
		},
	},
	computed: {
		icons() {
			return Icon;
		},
		categories() {
			return CardCategory;
		},
		/**
		 * Browse the store to create a tag for each card (excluding objects with the specified IDs, if any)
		 */
		availableTags(): Tag[] {
			const key = this.category + "s";

			let tags = this.$store.state.cards[key]
				.filter((card: CardTypes) => (this.excludeIds ? !this.excludeIds.includes(card.id) : true))
				.map((card: CardTypes) => new Tag(card));

			return tags;
		},
		/**
		 * Overwrite default v-model to bind the v-model attribute to the parent.
		 * This allows the parent component to get a 2-way data bind to this component seamlessly.
		 * In this case, it is used to control this component's opening state.
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		open: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			},
		},
	},
});
</script>

<style></style>
