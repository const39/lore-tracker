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

/**
 * Returns the current timestamp. To be used as a Unique Identifier.
 * @returns the current timestamp
 */
function uid() {
	return new Date().getTime();
}

export default {
	data: db.data,
	eventTypes: ["combat", "encounter", "discovery", "travel", "other"],
	addEvent: function(event) {
		if (event.desc && this.eventTypes.includes(event.type)) {
			db.data.events.push({
				id: uid(),
				desc: event.desc,
				locationId: event.locationId || undefined,
				charactersIds: event.charactersIds || undefined,
				type: event.type,
			});
			db.write();
		} else throw Error("Required field missing.");
	},
	addObjective: function(objective) {
		if (objective.desc) {
			db.data.objectives.push({
				id: uid(),
				desc: objective.desc,
				locationId: objective.locationId || undefined,
				charactersIds: objective.charactersIds || undefined,
			});
			db.write();
		} else throw Error("Required field missing.");
	},
	editObjective: function(objective) {
		if (objective.id && objective.desc) {
			let index = db.data.objectives.findIndex((entry) => entry.id === objective.id);
			if (index != -1) {
				db.data.objectives[index] = {
					id: objective.id,
					desc: objective.desc,
					locationId: objective.locationId || undefined,
					charactersIds: objective.charactersIds || undefined,
				};
				db.write();
			} else throw Error("The given object does not match any existing entry.");
		} else throw Error("Required field missing.");
	},
	addLocation: function(location) {
		if (location.name) {
			db.data.locations.push({
				id: uid(),
				name: location.name,
				desc: location.desc || undefined,
			});
			db.write();
		} else throw Error("Required field missing.");
	},
	addCharacter: function(character) {
		if (character.name && character.isNPC != undefined) {
			db.data.characters.push({
				id: uid(),
				name: character.name || undefined,
				race: character.race || undefined,
				classes: character.classes || undefined,
				role: character.role || undefined,
				isNPC: character.isNPC,
				desc: character.desc || undefined,
			});
			db.write();
		} else throw Error("Required fields missing.");
	},
	addNote: function(note) {
		if (note.desc) {
			db.data.notes.push({
				id: uid(),
				title: note.title || undefined,
				desc: note.desc,
			});
			db.write();
		} else throw Error("Required fields missing.");
	},
};
