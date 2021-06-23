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
	whichObjectIcon: function(object) {
		if (object) {
			if (object instanceof Event) return this[object.type];
			else return this[object.constructor.name.toLowerCase()];
		}
	},
};
