<template>
	<span>
		<v-btn @click="shown = !shown">
			<v-icon>mdi-magnify</v-icon>
			{{ $t("search.search") }}
		</v-btn>
		<v-snackbar light top max-width="70%" transition="scroll-y-transition" :timeout="-1" v-model="shown">
			<v-row class="d-flex pt-3">
				<v-text-field
					solo
					dense
					class="mx-2 flex-grow-1 flex-shrink-1"
					:label="$t('search.containing')"
					:hint="$t('search.containing')"
					v-model="textToContain"
				></v-text-field>
				<TagChooser solo dense class="mx-2 flex-grow-0 flex-shrink-1" :overflow="true" v-model="selectedTags" />
				<v-select
					outlined
					dense
					class="mx-2 flex-grow-0 flex-shrink-1"
					:label="$t('search.in')"
					v-model="selectedCategory"
					:items="categories"
				>
					<template v-slot:selection="data">
						<v-icon left small> {{ icons[data.item] }} </v-icon>
						{{ $t(`objectTypes.${data.item}`) }}
					</template>
					<template v-slot:item="data">
						<v-icon left small> {{ icons[data.item] }} </v-icon>
						{{ $t(`objectTypes.${data.item}`) }}
					</template>
				</v-select>
			</v-row>
			<div class="d-flex">
				<span class="grey--text text-caption"> {{ resultsNumber + $t("search.cardsShown") }} </span>
				<v-spacer></v-spacer>
				<span class="grey--text text-caption">{{ $t("search.sortDisabled") }}</span>
			</div>
			<template v-slot:action>
				<v-btn icon @click="shown = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</template>
		</v-snackbar>
	</span>
</template>

<script lang="ts">
import Vue from "vue";
import { CategoryFilter, Icon } from "@/js/types";
import TagChooser from "./cards/tags/TagChooser.vue";

export default Vue.extend({
	components: {
		TagChooser,
	},
	data() {
		return {
			shown: false,
			icons: Icon,
			categories: Object.values(CategoryFilter),
			selectedCategory: CategoryFilter.ALL,
			textToContain: "",
			selectedTags: [],
		};
	},
	methods: {
		search() {
			this.$store.commit("changeFilter", {
				category: this.selectedCategory,
				text: this.textToContain,
				tags: this.selectedTags,
			});
		},
		/**
		 * Open/close the Search view when pressing Ctrl+K
		 */
		hotkey(e: KeyboardEvent) {
			if (e.code === "KeyK" && e.ctrlKey) this.shown = !this.shown;
		},
	},
	computed: {
		style(): string {
			return this.shown ? "display: block;" : "display: none;";
		},
		resultsNumber() {
			return this.$store.state.filter.nbResults;
		},
	},
	watch: {
		/**
		 * Reset filter once the search view is closed
		 */
		shown(newValue) {
			if (!newValue) this.$store.commit("resetFilter");
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
