<template>
	<SelectorActivator :title="$t('options.themes.optionName')">
		<BaseSelector :items="themeList" @change="selectTheme">
			<template v-slot:default="item">
				<div>
					<v-sheet
						height="96"
						width="96"
						class="clickable"
						:style="computeSheetStyle(item.colors.primary, item.colors.background)"
					></v-sheet>
					<span> {{ item.name }} </span>
				</div>
			</template>
		</BaseSelector>
	</SelectorActivator>
</template>

<script>
import constants from "../../js/constants.js";

import BaseSelector from "./BaseSelector.vue";
import SelectorActivator from "./SelectorActivator.vue";

export default {
	components: {
		BaseSelector,
		SelectorActivator,
	},
	methods: {
		computeSheetStyle(primary, background) {
			let p = primary?.base || primary;
			let b = background?.base || background;

			return `background: linear-gradient(45deg, ${b} 50%, ${p} 50%); `;
		},
		selectTheme(themeKey) {
			this.$vuetify.theme.dark = themeKey === "dark";
			localStorage.setItem(constants.localStorageKeys.THEME_KEY, themeKey);
		},
	},
	computed: {
		themeList() {
			let list = [];

			// Browse default themes
			for (const key in this.$vuetify.theme.defaults) {
				const theme = this.$vuetify.theme.defaults[key];
				list.push({
					key: key,
					name: this.$t(`options.themes.${key}`),
					colors: theme,
				});
			}

			return list;
		},
	},
};
</script>
