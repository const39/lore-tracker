import { LowSync, JSONFileSync } from "lowdb";

const SAVE_DIR = "./saves/";
const SAVE_FILE = SAVE_DIR + "save.json";

const db = new LowSync(new JSONFileSync(SAVE_FILE));
db.read(); // Reads file to init db.data (null if file doesn't exist)

// If data is null, init with default empty object
db.data ||= {
	objectives: [],
	events: [],
	locations: [],
	characters: [],
	notes: [],
};

export default {
	data: db.data,
	eventTypes: ["combat", "encounter", "discovery", "travel", "other"],
	/**
	 * Writes current data store to file.
	 */
	persist: function() {
		db.write();
	},
	/**
	 * Returns the current timestamp. To be used as a Unique Identifier.
	 * @returns the current timestamp
	 */
	uid: function() {
		return new Date().getTime();
	},
	/**
	 * Clones the given object.
	 * @param {Object} object the object to clone. Must be a "simple" object (i.e. that can be parsed in JSON).
	 * @returns a copy of object
	 */
	clone: function(object) {
		return JSON.parse(JSON.stringify(object));
	},
	/**
	 * Deletes the objective with the specified 'id' value from the store.
	 * @param {Number} id the record 'id' field
	 */
	deleteObjective(id) {
		let index = this.data.objectives.findIndex((entry) => entry.id === id);
		if (index != -1) {
			this.data.objectives.splice(index, 1);
			db.write();
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
			db.write();
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
			db.write();
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
			db.write();
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
			db.write();
		}
	},
};
