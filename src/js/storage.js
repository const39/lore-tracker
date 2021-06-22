import { Objective, Event, Character, Location, Note } from "./model.js";

const DATA_KEY = "DATA";

function read(key) {
	// Get persisted raw data
	let rawData = localStorage.getItem(key).trim();

	if (rawData) rawData = JSON.parse(rawData);

	// Set data object as default
	let data = {
		objectives: [],
		events: [],
		locations: [],
		characters: [],
		notes: [],
	};

	// If rawData is exploitable
	if (rawData) {
		// Convert all raw JS objects as Objective instances
		for (const entry of rawData.objectives) data.objectives.push(new Objective(entry));

		// Convert all raw JS objects as Event instances
		for (const entry of rawData.events) data.events.push(new Event(entry));

		// Convert all raw JS objects as Location instances
		for (const entry of rawData.locations) data.locations.push(new Location(entry));

		// Convert all raw JS objects as Character instances
		for (const entry of rawData.characters) data.characters.push(new Character(entry));

		// Convert all raw JS objects as Note instances
		for (const entry of rawData.notes) data.notes.push(new Note(entry));
	}

	return data;
}

function persist(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

// Reads the persisted data.
let data = read(DATA_KEY);

export default {
	data,
	eventTypes: ["combat", "encounter", "discovery", "travel", "other"],
	schema: {
		type: Object,
		required: true,
		validator: function(value) {
			let isValid = true;
			const schema = [
				{
					key: "objectives",
					type: Objective,
				},
				{
					key: "events",
					type: Event,
				},
				{
					key: "locations",
					type: Location,
				},
				{
					key: "characters",
					type: Character,
				},
				{
					key: "notes",
					type: Note,
				},
			];

			for (const schemaElem of schema) {
				const valueElem = value[schemaElem.key];
				isValid =
					valueElem &&
					Array.isArray(valueElem) &&
					valueElem.every((entry) => entry instanceof schemaElem.type);
				if (!isValid) return false;
			}
			return isValid;
		},
	},
	/**
	 * Writes current data store to file.
	 */
	persist: function() {
		persist(DATA_KEY, data);
	},
	/**
	 * Deletes the objective with the specified 'id' value from the store.
	 * @param {Number} id the record 'id' field
	 */
	deleteObjective(id) {
		let index = this.data.objectives.findIndex((entry) => entry.id === id);
		if (index != -1) {
			this.data.objectives.splice(index, 1);
			this.persist();
		}
	},
	/**
	 * Deletes the event with the specified 'id' value from the store.
	 * @param {Number} id the record 'id' field
	 */
	deleteEvent(id) {
		let index = this.data.events.findIndex((entry) => entry.id === id);
		if (index != -1) {
			this.data.events.splice(index, 1);
			this.persist();
		}
	},
	/**
	 * Deletes the location with the specified 'id' value from the store.
	 * @param {Number} id the record 'id' field
	 */
	deleteLocation(id) {
		let index = this.data.locations.findIndex((entry) => entry.id === id);
		if (index != -1) {
			// Remove eventual references to the current location in events and objectives
			this.data.events.forEach((event) => {
				if (event.locationId === id) event.locationId = undefined;
			});

			this.data.objectives.forEach((objective) => {
				if (objective.locationId === id) objective.locationId = undefined;
			});

			this.data.locations.splice(index, 1);
			this.persist();
		}
	},
	/**
	 * Deletes the character with the specified 'id' value from the store.
	 * @param {Number} id the record 'id' field
	 */
	deleteCharacter(id) {
		let index = this.data.characters.findIndex((entry) => entry.id === id);
		if (index != -1) {
			// Remove eventual references to the current character in events and objectives
			this.data.events.forEach((event) => {
				let referenceIndex = event.charactersIds.findIndex((event) => event === id);
				if (referenceIndex != -1) event.charactersIds.splice(referenceIndex, 1);
			});

			this.data.objectives.forEach((objective) => {
				let referenceIndex = objective.charactersIds.findIndex((objective) => objective === id);
				if (referenceIndex != -1) objective.charactersIds.splice(referenceIndex, 1);
			});

			this.data.characters.splice(index, 1);
			this.persist();
		}
	},
	/**
	 * Deletes the note with the specified 'id' value from the store.
	 * @param {Number} id the record 'id' field
	 */
	deleteNote(id) {
		let index = this.data.notes.findIndex((entry) => entry.id === id);
		if (index != -1) {
			this.data.notes.splice(index, 1);
			this.persist();
		}
	},
};
