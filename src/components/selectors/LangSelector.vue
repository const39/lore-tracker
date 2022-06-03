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

<script>
import constants from "../../js/constants.js";
import translation from "../../js/translation.js";

import BaseSelector from "./BaseSelector.vue";
import SelectorActivator from "./SelectorActivator.vue";

export default {
	components: {
		BaseSelector,
		SelectorActivator,
	},
	methods: {
		selectLang(lang) {
			this.$vuetify.lang.current = lang;
			translation.setLocale(lang);

			localStorage.setItem(constants.localStorageKeys.LANG_KEY, lang);
		},
	},
	computed: {
		langList() {
			return [
				{
					key: "fr",
					name: "Français",
				},
				{
					key: "en",
					name: "English",
				},
			];
		},
	},
};
</script>

<style></style>
