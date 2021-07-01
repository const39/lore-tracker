import Vue from "vue";
import Vuex from "vuex";
import constants from "../js/constants";
import { Objective, Event, Location, Character, Note } from "../js/model";

Vue.use(Vuex);


/**
 * Create the default Cards object
 * @returns a default Cards object
 */
function defaultCards() {
	return {
		objectives: [],
		events: [],
		locations: [],
		characters: [],
		notes: [],
	};
}

/**
 * Create the default Filter object
 * @returns a default Filter object
 */
function defaultFilter() {
	return {
		isEnabled: false,
		nbResults: -1,
		type: constants.objectTypes.ALL,
		text: undefined,
		tags: [],
	};
}

export default new Vuex.Store({
	state: {
		name: 'Campaign',
		days: 0,
		season: constants.seasons.SPRING,
		cards: defaultCards(),
		filter: defaultFilter(),
	},
	getters: {
		filteredCards: (state) => {
			// Create another empty cards object to avoid modifying the state containing all cards
			let filteredCards = defaultCards();
			state.filter.nbResults = 0;
			state.filter.text = state.filter.text?.toLowerCase();

			// Browse each array of cards
			for (const key in state.cards) {
				// The filter is applied to each relevant key (can be ALL)
				if (state.filter.type == constants.objectTypes.ALL || `${state.filter.type}s` === key) {
					// Filter out corresponding cards from the initial cards object
					filteredCards[key] = state.cards[key].filter((entry) => {
						/* The predicate conditions are exclusive :
						 * (1) if the first one is not fulfilled, the second one is not evaluated;
						 * (2) if any condition is evaluated to false, the predicate is considered not fulfilled
						 * In either case, the predicate returns false
						 * In other words, the only way for the predicate to return true is that each specified condition is evaluated to true
						 */
						let predicate = true;

						// If specified, search for corresponding text in text fields of the current entry
						if (state.filter.text) {
							predicate =
								entry.title?.toLowerCase().includes(state.filter.text) ||
								entry.name?.toLowerCase().includes(state.filter.text) ||
								entry.desc?.toLowerCase().includes(state.filter.text);
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
		where: (state) => (id, type) => {
			// If type is specified, try to search in the specified array first
			if (type) {
				// Compute key from type
				const key = type + "s";

				// If key is a valid key in state.cards
				if (Object.keys(state.cards).includes(key)) {
					// Check if the specified id references an object in the array
					const index = state.cards[key].findIndex((entry) => entry.id === id);
					if (index != -1) return { key, index };
				}
			}

			// If the first search has failed or has not been tested, search in each array for an object with the specified id
			for (const key in state.cards) {
				// Check if the specified id references an object in the array
				const index = state.cards[key].findIndex((entry) => entry.id === id);
				if (index != -1) return { key, index };
			}
		},
		get: (state, getters) => (id, type) => {
			const location = getters.where(id, type);
			if (location) return state.cards[location.key][location.index];
		},
		getJsonData: (state) => {
			return JSON.stringify({
				name: state.name,
				days: state.days,
				season: state.season,
				cards: state.cards,
			});
		}
	},
	mutations: {
		initData(state) {
			// Reset cards
			state.cards = defaultCards();

			// Get persisted raw data
			let rawData = localStorage.getItem(constants.localStorageKeys.DATA_KEY);

			if (rawData) rawData = JSON.parse(rawData);

			// If JSON parsing is exploitable
			if (rawData) {
				// Convert all raw JS objects as Objective instances
				for (const entry of rawData.cards.objectives) state.cards.objectives.push(new Objective(entry));

				// Convert all raw JS objects as Event instances
				for (const entry of rawData.cards.events) state.cards.events.push(new Event(entry));

				// Convert all raw JS objects as Location instances
				for (const entry of rawData.cards.locations) state.cards.locations.push(new Location(entry));

				// Convert all raw JS objects as Character instances
				for (const entry of rawData.cards.characters) state.cards.characters.push(new Character(entry));

				// Convert all raw JS objects as Note instances
				for (const entry of rawData.cards.notes) state.cards.notes.push(new Note(entry));

				// Set other fields
				if(rawData.name) state.name = rawData.name;
				if(rawData.days) state.days = rawData.days;
				if(rawData.season) state.season = rawData.season;
			}
		},
		persist() {
			localStorage.setItem(constants.localStorageKeys.DATA_KEY, this.getters.getJsonData);
		},
		add(state, payload) {
			let list;
			if (payload instanceof Objective) list = state.cards.objectives;
			else if (payload instanceof Event) list = state.cards.events;
			else if (payload instanceof Location) list = state.cards.locations;
			else if (payload instanceof Character) list = state.cards.characters;
			else if (payload instanceof Note) list = state.cards.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

			list.unshift(payload);
			this.commit("persist");
		},
		update(state, payload) {
			let list;
			if (payload instanceof Objective) list = state.cards.objectives;
			else if (payload instanceof Event) list = state.cards.events;
			else if (payload instanceof Location) list = state.cards.locations;
			else if (payload instanceof Character) list = state.cards.characters;
			else if (payload instanceof Note) list = state.cards.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

			const index = list.findIndex((entry) => entry.id === payload.id);
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://vuejs.org/v2/guide/reactivity.html#For-Arrays
			if (index !== -1) {
				Vue.set(list, index, payload);
				this.commit("persist");
			}
		},
		delete(state, payload) {
			let list;
			if (payload instanceof Objective) list = state.cards.objectives;
			else if (payload instanceof Event) list = state.cards.events;
			else if (payload instanceof Location) list = state.cards.locations;
			else if (payload instanceof Character) list = state.cards.characters;
			else if (payload instanceof Note) list = state.cards.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

			const index = list.findIndex((entry) => entry.id === payload.id);
			if (index !== -1) {
				// Search in each array for eventual entries referencing the object we're about to delete
				for (const key in state.cards) {
					state.cards[key].forEach((entry) => {
						// If this entry's tags contain a reference to the object we're about to delete, remove it
						const referenceIndex = entry.tags.findIndex((event) => event === payload.id);
						if (referenceIndex != -1) entry.tags.splice(referenceIndex, 1);
					});
				}

				// Finally delete the payload object from state
				list.splice(index, 1);
				this.commit("persist");
			}
		},
		updateWholeList(state, payload) {
			const key = payload.type.toString().toLowerCase() + "s";
			Vue.set(state.cards, key, payload.list);
			this.commit("persist");
		},
		resetCards(state) {
			Vue.set(state, "cards", defaultCards());
			this.commit("persist");
		},
		changeFilter(state, payload) {
			state.filter.isEnabled = true;
			state.filter.type = payload.type || constants.objectTypes.ALL;
			state.filter.text = payload.text || undefined;
			state.filter.tags = payload.tags || [];
		},
		resetFilter(state) {
			Vue.set(state, "filter", defaultFilter());
		},
		changeName(state, payload) {
			if(payload) {
				state.name = payload
				this.commit("persist");
			}
		},
		changeDaysCount(state, payload) {
			if (Number.isSafeInteger(payload) && payload > -1) {
				state.days = payload;
				this.commit("persist");
			}
		},
		changeSeason(state, payload) {
			if (Object.values(constants.seasons).includes(payload)) {
				state.season = payload;
				this.commit("persist");
			}
		},
	},
	actions: {},
	modules: {},
});
