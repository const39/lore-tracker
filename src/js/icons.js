export default {
	objective: "mdi-star-circle",
	event: "mdi-sword-cross",
	location: "mdi-home",
	character: "mdi-account",
	note: "mdi-note-text",
	completed: "mdi-check-decagram",
	player: "mdi-account",
	npc: "mdi-controller-classic",
	combat: "mdi-sword-cross",
	encounter: "mdi-account-group",
	discovery: "mdi-magnify",
	travel: "mdi-horseshoe",
	other: "mdi-help",

	whichEventIcon: function(eventType) {
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
	},
};