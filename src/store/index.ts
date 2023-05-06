import { watchIgnorable } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { deepUnref } from "@/composables/deepUnref";
import { LocalStorageKey, Season } from "@/core/constants";
import { CardsStoreSerialized } from "@/core/model/cards";
import saves, { SaveVersion } from "@/core/saves";
import utilities from "@/core/utilities";
import { useCampaignInfoStore } from "./campaignInfo";
import { useCardsStore } from "./cards";
import { useQuickNoteStore } from "./quickNote";

export interface MetaData {
	version: SaveVersion.Latest;
	lastUpdate: string; // ISO date-time format | Format not enforced !
}

export interface SerializedState {
	// _meta: MetaData;
	name: string;
	days: number;
	season: Season;
	cards: CardsStoreSerialized;
	quickNote: string;
}

// ! On each update to to SaveFormat or its type dependencies (i.e. any of the above types)
// *** Update/Create save format converter in saves.ts
// *** Regenerate JSON Schema on each update :
// * => npx ts-json-schema-generator --path .\src\store\index.ts --type SaveFormat --tsconfig tsconfig_schema-generation.json -o .\src\schemas\save_format_<SAVE-VERSION>.json
export interface SaveFormat extends SerializedState {
	_meta: MetaData;
}

export const useStore = defineStore("store", () => {
	const stores = [
		useCampaignInfoStore(),
		useCardsStore(),
		useQuickNoteStore(),
	];

	const serializedState = computed(() => {
		const aggregatedState = stores.reduce(
			(acc, store) => ({ ...acc, ...store.serializableState }),
			{}
		) as SerializedState; // Type assertion because before deepUnref(), aggregatedState still contains the stores's deep Refs

		return deepUnref(reactive(aggregatedState));
	});

	const { ignoreUpdates } = watchIgnorable(serializedState, () => save(), {
		deep: true,
	});

	function setState(payload: SerializedState) {
		stores.forEach((store) => store.$hydrate(payload));
	}

	function resetState() {
		stores.forEach((store) => store.$reset());
	}

	function toJSON() {
		// Clone state to avoid modifying it
		const serialized: any = utilities.deepCopy(serializedState.value);
		serialized._meta = {
			version: SaveVersion.Latest,
			lastUpdate: new Date().toISOString(),
		};
		return JSON.stringify(serialized);
	}

	function toFile() {
		return new Blob([toJSON()], { type: "application/json" });
	}

	function loadData(json?: string) {
		// Get persisted raw data (from argument or from LocalStorage if no argument)
		const rawData = json || localStorage.getItem(LocalStorageKey.DATA_KEY);

		// Perform parsing, validation and conversion if there is data
		// If there is no data to be used, leave the default state as is
		if (rawData) {
			// * Validate (and convert if necessary) save format
			// The conversion method will throw an error if the save cannot be used. If an error is thrown:
			//  - It is not caught to propagate it to UI
			//  - Current state is not lost because it has not been cleared
			const validData = saves.ensureLatestVersion(JSON.parse(rawData));
			// Disable auto persistence during state setting to avoid persisting the data immediately
			ignoreUpdates(() => setState(validData));
		}
	}

	function save() {
		localStorage.setItem(LocalStorageKey.DATA_KEY, toJSON());
	}

	function deleteSave() {
		localStorage.removeItem(LocalStorageKey.DATA_KEY);
	}

	return {
		resetState,
		toFile,
		loadData,
		save,
		deleteSave,
	};
});
