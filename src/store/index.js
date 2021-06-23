import Vue from "vue";
import Vuex from "vuex";
import constants from "../js/constants";
import { Objective, Event, Location, Character, Note } from "../js/model";

Vue.use(Vuex);

function persist(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Create the default Data object
 * @returns a default Data object
 */
function defaultData() {
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
		data: defaultData(),
		filter: defaultFilter(),
	},
	getters: {
		filteredData: (state) => {
			// Create another empty data object to avoid modifying the state containing all data
			let filteredData = defaultData();
			state.filter.nbResults = 0;
			state.filter.text = state.filter.text?.toLowerCase();

			// Browse each array of data
			for (const key in state.data) {

				// The filter is applied to each relevant key (can be ALL)
				if (state.filter.type == constants.objectTypes.ALL || `${state.filter.type}s` === key) {

					// Filter out corresponding data from the initial data object 
					filteredData[key] = state.data[key].filter((entry) => {

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
					state.filter.nbResults += filteredData[key].length;
				}
			}
			return filteredData;
		},
		where: (state) => (id, type) => {
			// If type is specified, try to search in the specified array first
			if (type) {
				// Compute key from type
				const key = type + "s";

				// If key is a valid key in state.data
				if (Object.keys(state.data).includes(key)) {
					// Check if the specified id references an object in the array
					const index = state.data[key].findIndex((entry) => entry.id === id);
					if (index != -1) return { key, index };
				}
			}

			// If the first search has failed or has not been tested, search in each array for an object with the specified id
			for (const key in state.data) {
				// Check if the specified id references an object in the array
				const index = state.data[key].findIndex((entry) => entry.id === id);
				if (index != -1) return { key, index };
			}
		},
		get: (state, getters) => (id, type) => {
			const location = getters.where(id, type);
			if (location) return state.data[location.key][location.index];
		},
	},
	mutations: {
		initData(state) {
			// Get persisted raw data
			let rawData = localStorage.getItem(constants.localStorageKeys.DATA_KEY);

			if (rawData) rawData = JSON.parse(rawData);

			// If JSON parsing is exploitable
			if (rawData) {
				// Convert all raw JS objects as Objective instances
				for (const entry of rawData.objectives) state.data.objectives.push(new Objective(entry));

				// Convert all raw JS objects as Event instances
				for (const entry of rawData.events) state.data.events.push(new Event(entry));

				// Convert all raw JS objects as Location instances
				for (const entry of rawData.locations) state.data.locations.push(new Location(entry));

				// Convert all raw JS objects as Character instances
				for (const entry of rawData.characters) state.data.characters.push(new Character(entry));

				// Convert all raw JS objects as Note instances
				for (const entry of rawData.notes) state.data.notes.push(new Note(entry));
			}
		},
		add(state, payload) {
			let list;
			if (payload instanceof Objective) list = state.data.objectives;
			else if (payload instanceof Event) list = state.data.events;
			else if (payload instanceof Location) list = state.data.locations;
			else if (payload instanceof Character) list = state.data.characters;
			else if (payload instanceof Note) list = state.data.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

			list.unshift(payload);
			persist(constants.localStorageKeys.DATA_KEY, state.data);
		},
		update(state, payload) {
			let list;
			if (payload instanceof Objective) list = state.data.objectives;
			else if (payload instanceof Event) list = state.data.events;
			else if (payload instanceof Location) list = state.data.locations;
			else if (payload instanceof Character) list = state.data.characters;
			else if (payload instanceof Note) list = state.data.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

			const index = list.findIndex((entry) => entry.id === payload.id);
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://vuejs.org/v2/guide/reactivity.html#For-Arrays
			if (index !== -1) {
				Vue.set(list, index, payload);
				persist(constants.localStorageKeys.DATA_KEY, state.data);
			}
		},
		delete(state, payload) {
			let list;
			if (payload instanceof Objective) list = state.data.objectives;
			else if (payload instanceof Event) list = state.data.events;
			else if (payload instanceof Location) list = state.data.locations;
			else if (payload instanceof Character) list = state.data.characters;
			else if (payload instanceof Note) list = state.data.notes;
			else {
				console.error(payload, "is not an instance of an accepted object.");
				return;
			}

			const index = list.findIndex((entry) => entry.id === payload.id);
			if (index !== -1) {
				// Search in each array for eventual entries referencing the object we're about to delete
				for (const key in state.data) {
					state.data[key].forEach((entry) => {
						// If this entry's tags contain a reference to the object we're about to delete, remove it
						const referenceIndex = entry.tags.findIndex((event) => event === payload.id);
						if (referenceIndex != -1) entry.tags.splice(referenceIndex, 1);
					});
				}

				// Finally delete the payload object from state
				list.splice(index, 1);
				persist(constants.localStorageKeys.DATA_KEY, state.data);
			}
		},
		updateWholeList(state, payload) {
			const key = payload.type.toString().toLowerCase() + "s";
			Vue.set(state.data, key, payload.list);
			persist(constants.localStorageKeys.DATA_KEY, state.data);
		},
		resetData(state) {
			Vue.set(state, "data", defaultData());
			persist(constants.localStorageKeys.DATA_KEY, state.data);
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
	},
	actions: {},
	modules: {},
});
