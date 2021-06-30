<template>
	<v-card>
		<v-card-text>
			<v-item-group mandatory>
				<v-container>
					<v-row class="d-flex justify-space-between">
						<div class="text-center text--primary" v-for="theme in themeList" :key="theme.key">
							<v-item v-slot="{ active, toggle }">
								<div>
									<v-sheet
										height="96"
										width="96"
										class="clickable"
										:style="
											computeSheetStyle(theme.colors.primary, theme.colors.background, active)
										"
										@click.stop="selectTheme(theme.key, toggle)"
									></v-sheet>
									<span> {{ theme.name }} </span>
								</div>
							</v-item>
						</div>
					</v-row>
				</v-container>
			</v-item-group>
		</v-card-text>
	</v-card>
</template>

<script>
import constants from "../js/constants.js";

export default {
	methods: {
		computeSheetStyle(primary, background, isActive) {
			let p = primary?.base || primary;
			let b = background?.base || background;

			let style = `background: linear-gradient(45deg, ${b} 50%, ${p} 50%); `;
			if (isActive) style += `border: 4px solid ${p};`;
			return style;
		},
		selectTheme(themeKey, callback) {
			this.$vuetify.theme.dark = themeKey === "dark";
			localStorage.setItem(constants.localStorageKeys.THEME_KEY, themeKey);

			if (callback) callback();
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

<style></style>
