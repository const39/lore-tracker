<template>
	<MenuActivator :title="$t('options.themes.optionName')" icon="mdi-brightness-6">
		<v-card>
			<v-card-text>
				<v-item-group v-model="prefStore.theme" active-class="active" mandatory>
					<v-container>
						<v-row class="d-flex justify-space-between">
							<v-item
								v-for="item in themeList"
								:key="item.key"
								v-slot="{ toggle }"
								:value="item.key"
							>
								<div class="ma-1 text-center" @click="toggle">
									<v-sheet
										:style="
											computeSheetStyle(
												item.colors.primary,
												item.colors.background
											)
										"
										height="72"
										width="72"
										class="clickable"
									/>
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
import { computed } from "vue";
import { useTheme } from "vuetify";
import { t as $t } from "@/core/translation";
import { usePreferencesStore } from "@/store/preferences";
import MenuActivator from "./MenuActivator.vue";

const theme = useTheme();
const prefStore = usePreferencesStore();

function computeSheetStyle(primary: string, background: string) {
	return `background: linear-gradient(45deg, ${background} 50%, ${primary} 50%); `;
}

const themeList = computed(() => {
	const list = [];

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
</script>
<style scoped>
.active {
	background-color: rgb(var(--v-theme-accent));
	border: 3px solid rgb(var(--v-theme-accent));
}
</style>
