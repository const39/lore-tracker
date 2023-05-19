import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useTheme } from "vuetify";
import { LocalStorageKey } from "@/core/constants";
import { SupportedLanguages } from "@/core/translation";
import type { Theme } from "@/plugins/vuetify";

export type { Theme } from "@/plugins/vuetify";
export type Order = "default" | "alphanumeric";
export type Density = "large" | "comfortable" | "compact";
export type DragAndDropMode = "disabled" | "sort" | "drop";

interface Preferences {
	cardsOrder: Order;
	cardsDensity: Density;
	language: SupportedLanguages;
	dragAndDropMode: DragAndDropMode;
}

function getDefaults(): Preferences {
	return {
		cardsOrder: "default",
		cardsDensity: "comfortable",
		language: SupportedLanguages.ENGLISH,
		dragAndDropMode: "disabled",
	};
}

export const usePreferencesStore = defineStore(
	"preferences",
	() => {
		const _themeStore = useTheme();
		const _defaults = getDefaults();

		const cardsOrder = ref<Order>(_defaults.cardsOrder);
		const cardsDensity = ref<Density>(_defaults.cardsDensity);
		const dragAndDropMode = ref(_defaults.dragAndDropMode);

		const language = ref<SupportedLanguages>(_defaults.language);
		const theme = ref<Theme>(_themeStore.global.name.value as Theme); // Directly get default theme from Vuetify

		// Update underlying Vuetify theme on 'theme' ref update
		// -> Cannot be done via a computed property because Pinia's persistence plugin does not persist computed properties
		watch(theme, (value) => {
			_themeStore.global.name.value = value;
		});

		return { cardsOrder, cardsDensity, dragAndDropMode, language, theme };
	},
	{
		persist: {
			key: LocalStorageKey.PREFERENCES_KEY,
			paths: ["cardsOrder", "cardsDensity", "language", "theme"], // Persist all preferences except Drag&Drop mode
		},
	}
);
