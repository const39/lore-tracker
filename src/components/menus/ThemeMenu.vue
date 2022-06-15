<template>
	<MenuActivator :title="$t('options.themes.optionName')" icon="mdi-brightness-6">
		<v-card>
			<v-card-text>
				<v-item-group mandatory active-class="active" v-model="selectedTheme">
					<v-container>
						<v-row class="d-flex justify-space-between">
							<v-item
								class="ma-1 text-center text--primary"
								v-for="item in themeList"
								:key="item.key"
								:value="item.key"
								v-slot="{ toggle }"
							>
								<div @click="toggle">
									<v-sheet
										height="72"
										width="72"
										class="clickable"
										:style="computeSheetStyle(item.colors.primary, item.colors.background)"
									></v-sheet>
									<span> {{ item.name }} </span>
								</div>
							</v-item>
						</v-row>
					</v-container>
				</v-item-group>
			</v-card-text>
		</v-card>
	</MenuActivator>
</template>

<script lang="ts">
import Vue from "vue";
import { LocalStorageKey } from "@/js/types";

import MenuActivator from "./MenuActivator.vue";

export default Vue.extend({
	components: {
		MenuActivator,
	},
	data() {
		return {
			selectedTheme: this.$vuetify.theme.dark ? "dark" : "light",
		};
	},
	methods: {
		computeSheetStyle(primary: any, background: any) {
			let p = primary?.base || primary;
			let b = background?.base || background;

			return `background: linear-gradient(45deg, ${b} 50%, ${p} 50%); `;
		},
	},
	computed: {
		themeList() {
			let list = [];

			// Browse default themes
			for (const key in this.$vuetify.theme.defaults) {
				const theme = this.$vuetify.theme.defaults[key];
				list.push({
					key,
					name: this.$t(`options.themes.${key}`),
					colors: theme,
				});
			}

			return list;
		},
	},
	watch: {
		selectedTheme(themeKey: string) {
			this.$vuetify.theme.dark = themeKey === "dark";
			localStorage.setItem(LocalStorageKey.THEME_KEY, themeKey);
		},
	},
});
</script>
<style scoped>
.active {
	background-color: var(--v-accent-base);
	border: 3px solid var(--v-accent-base);
}
.clickable:hover {
	cursor: pointer;
}
</style>
