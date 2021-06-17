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
}

var eventTypes = ["combat", "encounter", "discovery", "travel", "other"];

export class Event {
	constructor(object) {
		this.id = object?.id || uid();
		this.desc = object?.desc;
		this.type = eventTypes.includes(object?.type) ? object?.type : eventTypes.other
        this.tags = object?.tags || [];
	}
}

export class Location {
    constructor(object) {
        this.id = object?.id || uid();
        this.name = object?.name || "";
        this.desc = object?.desc || "";
        this.tags = object?.tags || [];
    }
}

export class Character {
    constructor(object) {
        this.id = object?.id || uid();
        this.name = object?.name || "";
        this.race = object?.race || "";
        this.classes = object?.classes || "";
        this.role = object?.role || "";
        this.isNPC = object?.isNPC || false;
        this.desc = object?.desc || "";
        this.tags = object?.tags || [];
    }
}

export class Note {
    constructor(object) {
        this.id = object?.id || uid();
        this.title = object?.title || "";
        this.desc = object?.desc || "";
        this.tags = object?.tags || [];
    }
}