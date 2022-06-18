<template>
	<div>
		<v-btn @click="open = !open">
			<v-icon>mdi-magnify</v-icon>
			{{ $t("search.search") }}
		</v-btn>
		<v-navigation-drawer v-if="open" app right width="320" class="pa-2">
			<v-row class="d-flex mx-2 my-5">
				<span class="text-h5 text--primary">{{ $t("search.search") }}</span>
				<v-spacer></v-spacer>
				<v-btn icon @click="open = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-row>
			<v-subheader>{{ $t("fields.category") }}</v-subheader>
			<v-select outlined dense class="mx-2" v-model="selectedCategory" :items="categories">
				<template v-slot:selection="data">
					<v-icon left small> {{ icons[data.item] }} </v-icon>
					{{ $t(`categories.${data.item}`) }}
				</template>
				<template v-slot:item="data">
					<v-icon left small> {{ icons[data.item] }} </v-icon>
					{{ $t(`categories.${data.item}`) }}
				</template>
			</v-select>
			<v-subheader>{{ $t("search.containing") }}</v-subheader>
			<v-textarea outlined dense class="mx-2" v-model="textToContain"></v-textarea>
			<v-subheader>{{ $t("search.taggedWith") }}</v-subheader>
			<TagListPanel class="mx-2" v-model="selectedTags" />
			<span class="mx-2 grey--text text-caption">{{ resultsNumber + $t("search.cardsMatching") }}</span>
			<br />
			<span class="mx-2 grey--text text-caption">{{ $t("search.sortDisabled") }}</span>
		</v-navigation-drawer>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { CategoryFilter, Icon } from "@/js/types";
import TagListPanel from "./cards/tags/TagListPanel.vue";

export default Vue.extend({
	components: {
		TagListPanel,
	},
	data() {
		return {
			open: false,
			icons: Icon,
			categories: Object.values(CategoryFilter),
			selectedCategory: CategoryFilter.ALL,
			textToContain: "",
			selectedTags: [],
		};
	},
	methods: {
		search() {
			this.$store.commit("updateFilter", {
				category: this.selectedCategory,
				text: this.textToContain,
				tags: this.selectedTags,
			});
		},
		/**
		 * Open/close the Search view when pressing Ctrl+K
		 */
		hotkey(e: KeyboardEvent) {
			if (e.code === "KeyK" && e.ctrlKey) this.open = !this.open;
		},
	},
	computed: {
		style(): string {
			return this.open ? "display: block;" : "display: none;";
		},
		resultsNumber() {
			return this.$store.getters.filteredCardCount;
		},
	},
	watch: {
		/**
		 * Reset filter once the search view is closed
		 */
		open(newValue) {
			if (!newValue) {
				this.selectedCategory = CategoryFilter.ALL;
				this.textToContain = "";
				this.selectedTags = [];
				this.$store.commit("resetFilter");
			} 
		},
		/**
		 * Trigger search as soon as a field changes
		 */
		selectedCategory() {
			this.search();
		},
		textToContain() {
			this.search();
		},
		selectedTags() {
			this.search();
		},
	},
	mounted() {
		document.addEventListener("keydown", this.hotkey);
	},
	beforeDestroy() {
		document.removeEventListener("keydown", this.hotkey);
	},
});
</script>
