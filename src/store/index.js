import Vue from "vue";
import Vuex from "vuex";
import constants from "../js/constants";
import { Objective, Event, Location, Character, Note } from "../js/model";

Vue.use(Vuex);

function persist(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

export default new Vuex.Store({
	state: {
		data: {
			objectives: [],
			events: [],
			locations: [],
			characters: [],
			notes: [],
		},
	},
	getters: {
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
				list.splice(index, 1);

				persist(constants.localStorageKeys.DATA_KEY, state.data);
			}
		},
		updateWholeList(state, payload) {
			const key = payload.type.toString().toLowerCase() + "s";
			state.data[key] = payload.list;
			persist(constants.localStorageKeys.DATA_KEY, state.data);
		},
	},
	actions: {},
	modules: {},
});
