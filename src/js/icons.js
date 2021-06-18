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
			if (object instanceof Event) return this.whichEventIcon(object.type);
			else return this[object.constructor.name.toLowerCase()];
		}
	},

	/**
	 * Decide which icon should be displayed for the specified Event type.
	 * @param {String} eventType the type of event
	 * @returns the relevant icon name
	 */
	whichEventIcon: function(eventType) {
		if (eventType) {
			switch (eventType.toLowerCase()) {
				case "combat":
					return this.combat;
				case "encounter":
					return this.encounter;
				case "discovery":
					return this.discovery;
				case "travel":
					return this.travel;
				default:
					return this.other;
			}
		} else return this.other;
	},
};
