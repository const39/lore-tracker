<template>
	<v-autocomplete
		v-model="selectedTag"
		:items="availableTags"
		item-text="text"
		item-value="id"
		dense
		autofocus
		:menu-props="{ 'max-width': '30%' }"
		append-outer-icon="mdi-chevron-right"
		@change="onChange"
		@click:append-outer="open = false"
		@keydown="categoryChangeHotkey"
	>
		<template v-slot:prepend>
			<v-menu bottom left>
				<template v-slot:activator="{ on: menu, attrs }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">{{ icons[category] }}</v-icon>
						</template>
						<span>{{ $t("actions.changeCategory") }}</span>
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
		/**
		 * Change the current category with Ctrl+Left/RightArrow
		 */
		categoryChangeHotkey(e: KeyboardEvent) {
			if (e.ctrlKey && e.code === "ArrowLeft") this.category = this.previousCategory;
			else if (e.ctrlKey && e.code === "ArrowRight") this.category = this.nextCategory;
		},
	},
	computed: {
		icons() {
			return Icon;
		},
		categories() {
			return CardCategory;
		},
		previousCategory(): CardCategory {
			const values = Object.values(this.categories);
			const currentIdx = values.indexOf(this.category);
			const prevIdx = currentIdx === 0 ? values.length - 1 : currentIdx - 1;
			return values[prevIdx];
		},
		nextCategory(): CardCategory {
			const values = Object.values(this.categories);
			const currentIdx = values.indexOf(this.category);
			const nextIdx = currentIdx === values.length - 1 ? 0 : currentIdx + 1;
			return values[nextIdx];
		},
		/**
		 * Browse the store to create a tag for each card (excluding objects with the specified IDs, if any)
		 */
		availableTags(): Tag[] {
			let tags = this.$store.state.cards[this.category]
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