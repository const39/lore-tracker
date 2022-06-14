import Vue from "vue";
import Vuex from "vuex";
import { createDirectStore } from "direct-vuex";
import { LocalStorageKey, Season, CardsStore, CategoryFilter, Filter, State, CardCategory, CardTypes, ID } from "@/js/types";
import saves, { SaveVersion } from "@/js/saves";

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
		nbResults: -1,
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

const { store, rootActionContext, moduleActionContext, rootGetterContext, moduleGetterContext } = createDirectStore({
	state: defaultState(),
	getters: {
		filteredCards: (state) => {
			// Create another empty cards object to avoid modifying the state containing all cards
			const filteredCards = defaultCards();
			state.filter.nbResults = 0;
			state.filter.text = state.filter.text.toLowerCase();

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
							// Search first in each text field (depending on the category)
							switch (entry._category) {
								case CardCategory.Character:
								case CardCategory.Location:
								case CardCategory.Faction:
									predicate = entry.name.toLowerCase().includes(state.filter.text) || entry.desc.toLowerCase().includes(state.filter.text);
									break;
								case CardCategory.Quest:
									predicate = entry.title.toLowerCase().includes(state.filter.text);
									predicate ||= entry.tasks.some(task => task.desc.toLowerCase().includes(state.filter.text));	// Check if at least one task contains the text filter
									break;
								case CardCategory.Note:
									predicate = entry.title.toLowerCase().includes(state.filter.text) || entry.desc.toLowerCase().includes(state.filter.text);
									break;
								default:
									predicate = entry.desc.toLowerCase().includes(state.filter.text);
									break;
							}
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
					// Store the number of results
					state.filter.nbResults += filteredCards[key].length;
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
		toJSON: (state) => {
			// Split state data to exclude filter from JSON
			const { filter, ...toSave } = state;
			// Update date
			toSave._meta.lastUpdate = new Date().toISOString();
			return JSON.stringify(toSave);
		},
	},
	mutations: {
		resetState(state) {
			// We use Object.assign() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
			Object.assign(state, defaultState());
		},
		loadData(state, payload?: string) {
			
			// Get persisted raw data (from payload or from LocalStorage if no payload)
			const rawData = payload ?? localStorage.getItem(LocalStorageKey.DATA_KEY);

			if(!rawData) throw new Error("No data to load! Both payload and LocalStorage are empty.");

			// * Validate (and convert if necessary) save format
			// The conversion method will throw an error if the save cannot be used. If an error is thrown:
			//  - It is not caught to propagate it to UI
			//  - Current state is not lost because it has not been cleared
			const parsedData = saves.convertToLatest(JSON.parse(rawData));
			Object.assign(state, parsedData);
		},
		add(state, payload: CardTypes) {
			state.cards[payload._category].unshift(payload);
			this.dispatch('save');
		},
		update(state, payload: CardTypes) {
			const list: CardTypes[] = state.cards[payload._category];
			const index = list.findIndex((entry) => entry.id === payload.id);
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Arrays
			if (index !== -1) {
				Vue.set(list, index, payload);
				this.dispatch('save');
			}
		},
		delete(state, payload: CardTypes) {
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
				this.dispatch('save');
			}
		},
		updateWholeList(state, payload: {category: CardCategory, list: CardTypes[]}) {
			Vue.set(state.cards, payload.category, payload.list);
			this.dispatch('save');
		},
		changeFilter(state, payload: Filter) {
			const cleanFilter = defaultFilter();
			state.filter.isEnabled = true;
			state.filter.category = payload.category || cleanFilter.category;
			state.filter.text = payload.text || cleanFilter.text;
			state.filter.tags = payload.tags || cleanFilter.tags;
		},
		resetFilter(state) {
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Arrays
			Vue.set(state, "filter", defaultFilter());
		},
		changeName(state, payload: string) {
			if (payload) {
				state.name = payload;
				this.dispatch('save');
			}
		},
		changeDaysCount(state, payload: number) {
			if (Number.isSafeInteger(payload) && payload > -1) {
				state.days = payload;
				this.dispatch('save');
			}
		},
		changeSeason(state, payload: Season) {
			state.season = payload;
			this.dispatch('save');
		},
		changeQuickNote(state, payload: string) {
			state.quickNote = payload;
			this.dispatch('save');
		},
	},
	actions: {
		save({getters}) {
			localStorage.setItem(LocalStorageKey.DATA_KEY, getters.toJSON);
		},
		deleteSave() {
			localStorage.removeItem(LocalStorageKey.DATA_KEY);
		},
	},
	modules: {},
});

export default store;

export { rootActionContext, moduleActionContext, rootGetterContext, moduleGetterContext };

export type AppStore = typeof store;
declare module "vuex" {
	interface Store<S> {
		direct: AppStore;
	}
}
