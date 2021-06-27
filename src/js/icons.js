import constants from "./constants";
import { Event } from "./model";

export default {
	objective: "mdi-star-circle",
	event: "mdi-sword-cross",
	location: "mdi-home",
	character: "mdi-account",
	note: "mdi-note-text",
	completed: "mdi-check-decagram",
	combat: "mdi-sword-cross",
	encounter: "mdi-account-group",
	discovery: "mdi-magnify",
	travel: "mdi-horseshoe",
	other: "mdi-help",

	/**
	 * Decide which icon should be displayed for the specified object.
	 * @param {Objective | Event | Location | Character | Note} object the object to decide the icon of
	 * @returns the relevant icon name
	 */
	iconFromInstance: function(object) {
		if (object) {
			if (object instanceof Event) return this[object.type];
			else return this[object.constructor.name.toLowerCase()];
		}
	},
	iconFromObjectType: function(constant) {
		switch (constant) {
			case constants.objectTypes.OBJECTIVE:
				return this.objective;
			case constants.objectTypes.EVENT:
				return this.event;
			case constants.objectTypes.LOCATION:
				return this.location;
			case constants.objectTypes.CHARACTER:
				return this.character;
			case constants.objectTypes.NOTE:
				return this.note;
			default:
				return '';
		}
	},
	iconFromEventType: function(constant) {
		switch (constant) {
			case constants.eventTypes.COMBAT:
				return this.combat;
			case constants.eventTypes.ENCOUNTER:
				return this.encounter;
			case constants.eventTypes.DISCOVERY:
				return this.discovery;
			case constants.eventTypes.TRAVEL:
				return this.travel;
			case constants.eventTypes.OTHER:
				return this.other;
			default:
				return '';
		}
	}
};
