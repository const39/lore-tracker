import Vue from "vue";
import Vuex from "vuex";

import { Objective, Event, Location, Character, Note } from "../js/model";

Vue.use(Vuex);

const DATA_KEY = "DATA";

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
		findById: (state) => (type, id) => {
			if (type) {
				let list;
				switch (type.toString().toLowerCase()) {
					case "objective":
						list = state.data.objectives;
						break;
					case "event":
						list = state.data.events;
						break;
					case "location":
						list = state.data.locations;
						break;
					case "character":
						list = state.data.characters;
						break;
					case "note":
						list = state.data.notes;
						break;
					default:
						console.error(type, "is not a valid type.");
						return;
				}

				let record = list.find(entry => entry.id === id);
				if(record) return record;
			}
		},
	},
	mutations: {
		initData(state) {
			// Get persisted raw data
			let rawData = localStorage.getItem(DATA_KEY).trim();

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
			if (index !== -1) Vue.set(list, index, payload);
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
			if (index !== -1) list.splice(index, 1);
		},
	},
	actions: {},
	modules: {},
});
