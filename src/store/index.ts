import Vue from "vue";
import Vuex from "vuex";
import { createDirectStore } from "direct-vuex";
import { LocalStorageKey, Season, CardsStore, CategoryFilter, Filter, SaveFormat, State, CardCategory, CardTypes, ID } from "@/js/types";

Vue.use(Vuex);

/**
 * Create the default Cards object
 * @returns a default Cards object
 */
function defaultCards(): CardsStore {
	return {
		quests: [],
		events: [],
		locations: [],
		characters: [],
		factions: [],
		notes: [],
	};
}

/**
 * Create the default Filter object
 * @returns a default Filter object
 */
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
				if (state.filter.category === CategoryFilter.ALL || `${state.filter.category}s` === key) {
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
		where: (state) => (id: ID, category?: CardCategory): { key: string; index: number } | undefined => {
			// TODO refactor both search sequences in a single internal function

			// If category is specified, try to search in the specified array first
			if (category) {
				// Compute key from category
				const key = category + "s";

				// If key is a valid key in state.cards
				if (key in state.cards) {
					// Check if the specified id references an object in the array
					const index = state.cards[key as keyof typeof state.cards].findIndex((entry: CardTypes) => entry.id === id);
					if (index != -1) return { key, index };
				}
			}

			// If the first search has failed or has not been tested, search in each array for an object with the specified id
			for (const key in state.cards) {
				// Check if the specified id references an object in the array
				const index = state.cards[key as keyof typeof state.cards].findIndex((entry: CardTypes) => entry.id === id);
				if (index != -1) return { key, index };
			}
			return undefined;
		},
		get: (state, getters) => (id: ID, category?: CardCategory): CardTypes | undefined => {
			// TODO transform to generic type function + create 2nd function to get a content of any category
			const location = getters.where(id, category);
			if (location) return state.cards[location.key as keyof typeof state.cards][location.index];
			else return undefined;
		},
		getJsonData: (state) => {
			const data: SaveFormat = {
				name: state.name,
				days: state.days,
				season: state.season,
				cards: state.cards,
				quickNote: state.quickNote,
			};
			return JSON.stringify(data);
		},
	},
	mutations: {
		resetState(state) {
			// We use Object.assign() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
			Object.assign(state, defaultState());
		},
		loadData(state, payload?: string) {
			// Reset current state
			this.commit('resetState');
			
			// Get persisted raw data (from payload or from LocalStorage if no payload)
			const rawData = payload || localStorage.getItem(LocalStorageKey.DATA_KEY);

			// TODO add JSON Schema validation on rawData
			// TODO return Promise/throw Exception to inform UI when data is illegal/badly formatted

			// If JSON parsing is exploitable
			if (rawData) {
				const parsedData: SaveFormat = JSON.parse(rawData);

				// Set cards
				for (const entry of parsedData.cards.quests || []) state.cards.quests.push(entry);
				for (const entry of parsedData.cards.events || []) state.cards.events.push(entry);
				for (const entry of parsedData.cards.locations || []) state.cards.locations.push(entry);
				for (const entry of parsedData.cards.characters || []) state.cards.characters.push(entry);
				for (const entry of parsedData.cards.factions || []) state.cards.factions.push(entry);
				for (const entry of parsedData.cards.notes || []) state.cards.notes.push(entry);

				// Set other fields
				if (parsedData.name) state.name = parsedData.name;
				if (parsedData.days) state.days = parsedData.days;
				if (parsedData.season) state.season = parsedData.season;
				if (parsedData.quickNote) state.quickNote = parsedData.quickNote;
			}
		},
		add(state, payload: CardTypes) {
			let list: CardTypes[];
			if (payload._category === CardCategory.Quest) list = state.cards.quests;
			else if (payload._category === CardCategory.Event) list = state.cards.events;
			else if (payload._category === CardCategory.Location) list = state.cards.locations;
			else if (payload._category === CardCategory.Character) list = state.cards.characters;
			else if (payload._category === CardCategory.Faction) list = state.cards.factions;
			else if (payload._category === CardCategory.Note) list = state.cards.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

			list.unshift(payload);
			this.dispatch('save');
		},
		update(state, payload: CardTypes) {
			let list: CardTypes[];
			if (payload._category === CardCategory.Quest) list = state.cards.quests;
			else if (payload._category === CardCategory.Event) list = state.cards.events;
			else if (payload._category === CardCategory.Location) list = state.cards.locations;
			else if (payload._category === CardCategory.Character) list = state.cards.characters;
			else if (payload._category === CardCategory.Faction) list = state.cards.factions;
			else if (payload._category === CardCategory.Note) list = state.cards.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

			const index = list.findIndex((entry) => entry.id === payload.id);
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Arrays
			if (index !== -1) {
				Vue.set(list, index, payload);
				this.dispatch('save');
			}
		},
		delete(state, payload: CardTypes) {
			let list: CardTypes[];
			if (payload._category === CardCategory.Quest) list = state.cards.quests;
			else if (payload._category === CardCategory.Event) list = state.cards.events;
			else if (payload._category === CardCategory.Location) list = state.cards.locations;
			else if (payload._category === CardCategory.Character) list = state.cards.characters;
			else if (payload._category === CardCategory.Faction) list = state.cards.factions;
			else if (payload._category === CardCategory.Note) list = state.cards.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

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
			const key = payload.category.toString().toLowerCase() + "s";
			Vue.set(state.cards, key, payload.list);
			this.dispatch('save');
		},
		changeFilter(state, payload: Filter) {
			state.filter.isEnabled = true;
			state.filter.category = payload.category || CategoryFilter.ALL;
			state.filter.text = payload.text || "";
			state.filter.tags = payload.tags || [];
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
		save({state}) {

			const data: SaveFormat = {
				name: state.name,
				days: state.days,
				season: state.season,
				cards: state.cards,
				quickNote: state.quickNote,
			};
			const json = JSON.stringify(data);
			localStorage.setItem(LocalStorageKey.DATA_KEY, json);
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
