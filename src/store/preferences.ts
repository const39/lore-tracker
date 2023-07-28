import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useTheme } from "vuetify";
import { LocalStorageKey } from "@/core/save/save-manager";
import { SupportedLanguages } from "@/core/translation/translation";
import type { Theme } from "@/plugins/vuetify";

export type { Theme } from "@/plugins/vuetify";
export type Order = "default" | "alphanumeric";
export type Density = "large" | "comfortable" | "compact";
export type QuickNoteSize = { width?: number; height?: number };

interface Preferences {
	cardsOrder: Order;
	cardsDensity: Density;
	language: SupportedLanguages;
	quickNoteSize?: QuickNoteSize;
}

function getDefaults(): Preferences {
	return {
		cardsOrder: "default",
		cardsDensity: "comfortable",
		language: SupportedLanguages.ENGLISH,
	};
}

export const usePreferencesStore = defineStore(
	"preferences",
	() => {
		const _themeStore = useTheme();
		const _defaults = getDefaults();

		const cardsOrder = ref<Order>(_defaults.cardsOrder);
		const cardsDensity = ref<Density>(_defaults.cardsDensity);
		const quickNoteSize = ref<QuickNoteSize>();

		const language = ref<SupportedLanguages>(_defaults.language);
		const theme = ref<Theme>(_themeStore.global.name.value as Theme); // Directly get default theme from Vuetify

		// Update underlying Vuetify theme on 'theme' ref update
		// -> Cannot be done via a computed property because Pinia's persistence plugin does not persist computed properties
		watch(theme, (value) => {
			_themeStore.global.name.value = value;
		});

		return { cardsOrder, cardsDensity, language, theme, quickNoteSize };
	},
	{
		// @ts-ignore because ts-json-schema-generator raises a type error on this plugin option (it somehow seems to not find the plugin types)
		persist: {
			key: LocalStorageKey.PREFERENCES_KEY,
		},
	}
);
