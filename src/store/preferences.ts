import { SupportedLanguages } from "@/js/translation";
import { LocalStorageKey } from "@/js/types";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useTheme } from "vuetify";

export type Order = "default" | "alphanumeric";

interface Preferences {
	cardsOrder: Order;
	language: SupportedLanguages;
}

function getDefaults(): Preferences {
	return {
		cardsOrder: "default",
		language: SupportedLanguages.ENGLISH,
	};
}

export const usePreferencesStore = defineStore(
	"preferences",
	() => {
		const _themeStore = useTheme();
		const _defaults = getDefaults();

		const cardsOrder = ref<Order>(_defaults.cardsOrder);
		const language = ref<SupportedLanguages>(_defaults.language);
		const theme = ref(_themeStore.global.name.value); // Directly get default theme from Vuetify

		// Update underlying Vuetify theme on 'theme' ref update
		// -> Cannot be done via a computed property because Pinia's persistence plugin does not persist computed properties
		watch(theme, (value) => {
			_themeStore.global.name.value = value;
		});

		return { cardsOrder, language, theme };
	},
	{
		persist: { key: LocalStorageKey.PREFERENCES_KEY },
	}
);
