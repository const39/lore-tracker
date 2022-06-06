<template>
	<SelectorActivator :title="$t('options.lang.optionName')">
		<BaseSelector :items="langList" @change="selectLang">
			<template v-slot:default="item">
				<div>
					<v-sheet height="64" width="64" class="clickable">
						<v-img :src="require(`../assets/${item.key}.png`)"></v-img>
					</v-sheet>
					<span> {{ item.name }} </span>
				</div>
			</template>
		</BaseSelector>
	</SelectorActivator>
</template>

<script lang="ts">
import Vue from "vue";
import { SupportedLanguages } from "@/js/translation";
import translation from "@/js/translation";

import BaseSelector from "./BaseSelector.vue";
import SelectorActivator from "./SelectorActivator.vue";

export default Vue.extend({
	components: {
		BaseSelector,
		SelectorActivator,
	},
	methods: {
		selectLang(lang: SupportedLanguages) {
			this.$vuetify.lang.current = lang;
			translation.setLanguage(lang);
		},
	},
	computed: {
		langList() {
			return [
				{
					key: SupportedLanguages.FRENCH,
					name: "Français",
				},
				{
					key: SupportedLanguages.ENGLISH,
					name: "English",
				},
			];
		},
	},
});
</script>

<style></style>
