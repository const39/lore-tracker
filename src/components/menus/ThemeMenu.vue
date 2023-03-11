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

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { LocalStorageKey } from "@/js/types";
import { computed, ref, watch } from "vue";

import { useTheme } from "vuetify";
import MenuActivator from "./MenuActivator.vue";

const theme = useTheme();
const selectedTheme = ref(theme.current.value.dark ? "dark" : "light");

function computeSheetStyle(primary: any, background: any) {
	let p = primary?.base || primary;
	let b = background?.base || background;

	return `background: linear-gradient(45deg, ${b} 50%, ${p} 50%); `;
}

const themeList = computed(() => {
	let list = [];

	// Browse Vuetify theme settings
	const themes = theme.themes.value;
	for (const key in themes) {
		list.push({
			key,
			name: $t(`options.themes.${key}`),
			colors: themes[key as keyof typeof themes].colors,
		});
	}

	return list;
});

watch(selectedTheme, (themeKey: string) => {
	theme.global.name.value = themeKey;
	localStorage.setItem(LocalStorageKey.THEME_KEY, themeKey);
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
