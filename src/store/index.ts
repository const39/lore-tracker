import Vue from "vue";
import Vuex from "vuex";
import { LocalStorageKey, Season, CardsStore, CategoryFilter, Filter, State, CardCategory, CardTypes, ID, SaveFormat } from "@/js/types";
import saves, { SaveVersion } from "@/js/saves";
import utilities from "@/js/utilities";

Vue.use(Vuex);


function defaultCards(): CardsStore {
	// Generate automatically the CardsStore using the CardCategory enum values as keys
	const cards = {} as CardsStore;
	for(const category of Object.values(CardCategory)) cards[category] = [];
	return cards;
}

function defaultFilter(): Filter {
	return {
		isEnabled: false,
		alphanumericSort: false,
		category: CategoryFilter.ALL,
		text: "",
		tags: [],
	};
}

function defaultState(): State {
	return {
		_meta: {
			version: SaveVersion.Latest,
			lastUpdate: new Date().toISOString()
		},
		name: "Campaign",
		days: 0,
		season: Season.SPRING,
		cards: defaultCards(),
		filter: defaultFilter(),
		quickNote: "",
	}
}

export default new Vuex.Store({
	state: defaultState(),
	getters: {
		filteredCards: (state) => {
			// Create another empty cards object to avoid modifying the state containing all cards
			const filteredCards = defaultCards();

			// Browse each array of cards
			for (const field in state.cards) {
				const key = field as keyof typeof state.cards;

				// The filter is applied to each relevant key (can be ALL)
				if (state.filter.category === CategoryFilter.ALL || state.filter.category === key) {
					// Filter out corresponding cards from the initial cards object

					(filteredCards[key] as CardTypes[]) = (state.cards[key] as CardTypes[]).filter((entry) => {
						/* The predicate conditions are exclusive :
						 * (1) if the first one is not fulfilled, the second one is not evaluated;
						 * (2) if any condition is evaluated to false, the predicate is considered not fulfilled
						 * In either case, the predicate returns false
						 * In other words, the only way for the predicate to return true is that each specified condition is evaluated to true
						 */
						let predicate = true;

						// If specified, search for corresponding text in text fields of the current entry
						if (state.filter.text) {
							predicate = utilities.getAllText(entry).some(text => text.toLowerCase().includes(state.filter.text));
						}

						// If the previous condition has been fulfilled (if specified) and a tag condition is present (see (1)),
						// search for the corresponding tags in the current entry tag list
						if (predicate && state.filter.tags?.length > 0) {
							for (const tag of state.filter.tags) {
								predicate &&= entry.tags.includes(tag);
								// If the condition is false, stop searching and return (see (2))
								if (!predicate) break;
							}
						}

						return predicate;
					});
				}
			}

			// If alphanumeric sort is enabled, perform sort before returning
			if(state.filter.alphanumericSort) {
				for (const field in filteredCards) {

					filteredCards[field as keyof typeof filteredCards].sort((a: CardTypes, b: CardTypes) => {
						const textA = utilities.getText(a).toLowerCase();
						const textB = utilities.getText(b).toLowerCase();
						return textA.localeCompare(textB);
					});
				}
			}

			return filteredCards;
		},
		getByIdInCategory: (state) => (id: ID, category: CardCategory): CardTypes | undefined => {
			const idx = state.cards[category].findIndex((entry: CardTypes) => entry.id === id);
			return idx != -1 ? state.cards[category][idx] : undefined;
		},
		getById: (state, getters) => (id: ID): CardTypes | undefined => {
			for (const key in state.cards) {
				const ret = getters.getByIdInCategory(id, key);
				if(ret) return ret;
			}
			return undefined;
		},
		cardCount: (state) => {
			let count = 0;
			for (const key in state.cards) count += state.cards[key as keyof typeof state.cards].length
			return count;
		},
		filteredCardCount: (state, getters) => {
			let count = 0;
			for (const key in getters.filteredCards) count += getters.filteredCards[key as keyof typeof getters.filteredCards].length
			return count;
		},
		toJSON: (state) => {
			// Split state data to exclude filter from JSON
			const { filter, ...toSave } = { ...state };
			// Update date
			toSave._meta.lastUpdate = new Date().toISOString();
			return JSON.stringify(toSave);
		},
	},
	mutations: {
		// ** Whole state mutations **
		resetState(state) {
			// We use Object.assign() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
			Object.assign(state, defaultState());
		},
		/**
		 * Assign or add new values to the current state properties.
		 * The current state and the specified payload are merged: 
		 * 	- Payload new properties are added to the state;
		 * 	- Colliding properties are overwritten with payload values;
		 * 	- Pre-existing state properties not set in payload are left unchanged. 
		 * @param state 
		 * @param payload Payload to merge with current state. Can be either a State or SaveFormat object.
		 */
		setState(state, payload: State | SaveFormat) {
			Object.assign(state, payload);
		},
		// ** Card mutations **
		addCard(state, payload: CardTypes) {
			state.cards[payload._category].unshift(payload as any);
		},
		updateCard(state, payload: CardTypes) {
			const list: CardTypes[] = state.cards[payload._category];
			const index = list.findIndex((entry) => entry.id === payload.id);
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Arrays
			if (index !== -1) Vue.set(list, index, payload);
		},
		deleteCard(state, payload: CardTypes) {
			const list: CardTypes[] = state.cards[payload._category];
			const index = list.findIndex((entry) => entry.id === payload.id);
			if (index !== -1) {
				// Search in each array for eventual entries referencing the object we're about to delete
				for (const key in state.cards) {
					state.cards[key as keyof typeof state.cards].forEach((entry: CardTypes) => {
						// If this entry's tags contain a reference to the object we're about to delete, remove it
						const referenceIndex = entry.tags.findIndex((event: number) => event === payload.id);
						if (referenceIndex != -1) entry.tags.splice(referenceIndex, 1);
					});
				}

				// Finally delete the payload object from state
				list.splice(index, 1);
			}
		},
		updateWholeList(state, payload: {category: CardCategory, list: CardTypes[]}) {
			Vue.set(state.cards, payload.category, payload.list);
		},
		// ** Other data mutations **
		setName(state, payload: string) {
			if (payload) state.name = payload.trim();
		},
		setDaysCount(state, payload: number) {
			if (Number.isSafeInteger(payload) && payload > -1) state.days = payload;
		},
		setSeason(state, payload: Season) {
			if(payload) state.season = payload;
		},
		setQuickNote(state, payload: string) {
			state.quickNote = payload.trim() ?? "";
		},
		// ** Filter mutations **
		updateFilter(state, payload: Filter) {
			state.filter.isEnabled = true;
			
			// If payload does not contain the following properties, leave the current value as is
			// ! Only check for undefined/null using '??' instead of '||' to allow setting empty strings or booleans  
			state.filter.alphanumericSort = payload.alphanumericSort ?? state.filter.alphanumericSort;
			state.filter.category = payload.category ?? state.filter.category;
			state.filter.text = (payload.text ?? state.filter.text).toLowerCase();
			state.filter.tags = payload.tags ?? state.filter.tags;
		},
		resetFilter(state) {
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Arrays
			Vue.set(state, "filter", defaultFilter());
		},
	},
	actions: {
		commitAndSave({commit, dispatch}, obj: { commit: string, payload: object }) {
			commit(obj.commit, obj.payload);
			dispatch('save');
		},
		// ** Save actions
		loadData({commit}, payload?: string) {
			// Get persisted raw data (from payload or from LocalStorage if no payload)
			const rawData = payload || localStorage.getItem(LocalStorageKey.DATA_KEY);

			if(!rawData) throw new Error("No data to load! Both payload and LocalStorage are empty.");

			// * Validate (and convert if necessary) save format
			// The conversion method will throw an error if the save cannot be used. If an error is thrown:
			//  - It is not caught to propagate it to UI
			//  - Current state is not lost because it has not been cleared
			const parsedData = saves.convertToLatest(JSON.parse(rawData));
			commit('setState', parsedData);
		},
		save({getters}) {
			localStorage.setItem(LocalStorageKey.DATA_KEY, getters.toJSON);
		},
		deleteSave() {
			localStorage.removeItem(LocalStorageKey.DATA_KEY);
		},
	},
	modules: {},
});
