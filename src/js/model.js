import constants from "./constants";

/**
 * Returns the current timestamp. To be used as a Unique Identifier.
 * @returns the current timestamp
 */
function uid() {
	return new Date().getTime();
}

export class Objective {
	constructor(object) {
		this.id = object?.id || uid();
		this.desc = object?.desc;
		this.isCompleted = object?.isCompleted || false;
		this.tags = object?.tags || [];
	}

	getIcon() {
		return constants.icons.objective;
	}
}

export class Event {
	constructor(object) {
		this.id = object?.id || uid();
		this.desc = object?.desc;
		this.type = Object.values(constants.eventTypes).includes(object?.type)
			? object?.type
			: constants.eventTypes.other;
		let day = Number(object?.day);
		this.day = Number.isSafeInteger(day) && day > 0 ? day : 0;
		this.tags = object?.tags || [];
	}

	getIcon() {
		return constants.icons[this.type] || constants.icons.other;
	}
}

export class Location {
	constructor(object) {
		this.id = object?.id || uid();
		this.name = object?.name || "";
		this.desc = object?.desc || "";
		this.tags = object?.tags || [];
	}

	getIcon() {
		return constants.icons.location;
	}
}

export class Character {
	constructor(object) {
		this.id = object?.id || uid();
		this.name = object?.name || "";
		this.race = object?.race || "";
		this.classes = object?.classes || "";
		this.role = object?.role || "";
		this.isNPC = object?.isNPC === false ? false : true; // Defaults to True - Ternary condition to eliminate unwanted values (undefined, null...)
		this.isAlive = object?.isAlive === false ? false : true; // Defaults to True - Ternary condition to eliminate unwanted values (undefined, null...)
		this.desc = object?.desc || "";
		this.tags = object?.tags || [];
	}

	getIcon() {
		return constants.icons.character;
	}
}

export class Note {
	constructor(object) {
		this.id = object?.id || uid();
		this.title = object?.title || "";
		this.desc = object?.desc || "";
		this.tags = object?.tags || [];
	}

	getIcon() {
		return constants.icons.note;
	}
}

export class Tag {
	/**
	 * Create a new Tag from the object it references
	 * @param {Objective | Event | Location | Character | Note } refObject the object referenced by this tag
	 */
	constructor(refObject) {
		this.id = refObject.id;
		this.text = refObject.name || refObject.title || refObject.desc;
		this.type = constants.objectTypes[refObject.constructor.name.toUpperCase()];
		this.icon = refObject.getIcon();
	}
}
