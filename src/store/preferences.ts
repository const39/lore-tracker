import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useTheme } from "vuetify";
import { LocalStorageKey } from "@/core/constants";
import { SupportedLanguages } from "@/core/translation";

export type Order = "default" | "alphanumeric";
export type Density = "large" | "comfortable" | "compact";

interface Preferences {
	cardsOrder: Order;
	cardsDensity: Density;
	language: SupportedLanguages;
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
		const language = ref<SupportedLanguages>(_defaults.language);
		const theme = ref(_themeStore.global.name.value); // Directly get default theme from Vuetify

		// Update underlying Vuetify theme on 'theme' ref update
		// -> Cannot be done via a computed property because Pinia's persistence plugin does not persist computed properties
		watch(theme, (value) => {
			_themeStore.global.name.value = value;
		});

		return { cardsOrder, cardsDensity, language, theme };
	},
	{
		persist: { key: LocalStorageKey.PREFERENCES_KEY },
	}
);
