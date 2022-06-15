<template>
	<MenuActivator :title="$t('options.lang.optionName')" icon="mdi-translate">
		<v-list dense>
			<v-list-item-group mandatory v-model="selectedLang">
				<v-list-item v-for="lang in langList" :key="lang.key" :value="lang.key">
					<v-list-item-icon>
						<v-img max-width="32" max-height="32" :src="require(`@/assets/${lang.key}.png`)"></v-img>
					</v-list-item-icon>
					<v-list-item-title>{{ lang.name }}</v-list-item-title>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</MenuActivator>
</template>

<script lang="ts">
import Vue from "vue";
import translation, { SupportedLanguages } from "@/js/translation";

import MenuActivator from "./MenuActivator.vue";

export default Vue.extend({
	components: {
		MenuActivator,
	},
	data() {
		return {
			selectedLang: translation.getLanguage(),
		};
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
	watch: {
		selectedLang(val: SupportedLanguages) {
			translation.setLanguage(val);
			window.location.reload();
		},
	},
});
</script>

<style></style>
