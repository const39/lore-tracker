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
};
