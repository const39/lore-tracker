<template>
	<v-card>
		<v-card-text>
			<v-item-group mandatory>
				<v-container>
					<v-row class="d-flex justify-space-between">
						<div class="text-center text--primary" v-for="theme in themeList" :key="theme.name">
							<v-item v-slot="{ active, toggle }">
								<div>
									<v-sheet
										height="96"
										width="96"
										class="clickable"
										:style="
											computeSheetStyle(theme.colors.primary, theme.colors.background, active)
										"
										@click.stop="selectTheme(theme, toggle)"
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
import constants from '../js/constants.js';
import themes from "../plugins/themes.js";

export default {
	methods: {
		computeSheetStyle(primary, background, isActive) {
			let p = primary?.base || primary;
			let b = background?.base || background;

			let style = `background: linear-gradient(45deg, ${b} 50%, ${p} 50%); `;
			if (isActive) style += `border: 4px solid ${p};`;
			return style;
		},
		selectTheme(theme, callback) {
			this.$vuetify.theme.themes.light = theme.colors;
			this.$vuetify.theme.themes.dark = theme.colors;
			this.$vuetify.theme.dark = themes.darkThemes.includes(theme.name);

			localStorage.setItem(constants.localStorageKeys.THEME_KEY, theme.name);

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
					name: key,
					colors: theme,
				});
			}

			// Browse custom themes
			for (const key in themes.custom) {
				const theme = themes.custom[key];

				list.push({
					name: key,
					colors: theme,
				});
			}
			return list;
		},
	},
};
</script>

<style></style>
