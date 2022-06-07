export default {
	pages: {
		home: "Home",
		timeline: "Timeline",
	},

	timeline: {
		campaignStart: "Campaign start",
		noEvent: "No event registered. Add some on the ",
	},

	eventTypes: {
		combat: "Combat",
		encounter: "Encounter",
		discovery: "Discovery",
		travel: "Travel",
		other: "Other",
	},

	objectTypes: {
		all: "Any",
		objective: "Objective",
		event: "Event",
		location: "Location",
		character: "Character",
		note: "Note",
	},

	status: {
		day: "Day ",
		seasons: {
			spring: "Spring",
			summer: "Summer",
			autumn: "Autumn",
			winter: "Winter",
		},
		action: "Click to increase or decrease",
	},

	fields: {
		name: "Name",
		title: "Title",
		desc: "Description",
		tags: "Tags",
		mdSupport: "Markdown language supported",
		otherCounter: " other",
		tasks: "Tasks",
		noTask: "No task added yet",
		ongoing: "On-going",
		completed: "Completed",
		eventType: "Event type",
		eventDay: "Event date",
		race: "Race",
		class: "Class",
		role: "Role",
		npc: "NPC",
		player: "Player",
		alive: "Alive",
		dead: "Dead",
		unknownRace: "Unknown race",
		unknownClass: "Unknown class",
		unknownRole: "Unknown role",
		requiredField: "required field",
		dayNotValid: "invalid day",
	},

	dialogs: {
		addObjective: "Add an objective",
		addEvent: "Add an event",
		addLocation: "Add a location",
		addCharacter: "Add a character",
		addNote: "Add a note",

		editObjective: "Edit an objective",
		editEvent: "Edit an event",
		editLocation: "Edit a location",
		editCharacter: "Edit a character",
		editNote: "Edit a note",

		deleteTitle: "Delete ",
		deleteObjective: "Do you really want to delete this objective ?",
		deleteEvent: "Do you really want to delete this event ? This will also change the timeline.",
		deleteLocation: "Do you really want to delete this location ?",
		deleteCharacter: "Do you really want to delete this character ?",
		deleteNote: "Do you really want to delete this note ?",
	},

	search: {
		search: "Search",
		containing: "Containing",
		in: "In",
		cardsShown: " cards shown",
		sortDisabled: "Card sort disabled during search.",
	},

	actions: {
		close: "Close",
		save: "Save",
		yes: "Yes",
		no: "No",
		edit: "Edit",
		delete: "Delete",
		quickNote: "Quick note",
	},

	options: {
		themes: {
			optionName: "Change theme",
			light: "Light",
			dark: "Dark",
		},
		lang: {
			optionName: "Change language",
		},
		copyData: {
			optionName: "Copy data",
			success: "Data copied in clipboard",
		},
		deleteData: {
			optionName: "Delete data",
			title: "Delete data ?",
			message: "All saved data will be lost. Please consider backup your data first.",
		},
		about: {
			optionName: "About",
			title: "About Lore Tracker",
			link: "Source code",
		},
		hotkeys: {
			optionName: "Show hotkeys",
			title: "Hotkeys",
			pages: {
				title: "Pages",
				toHome: "Navigate to Home",
				toTimeline: "Navigate to Timeline",
			},
			content: {
				title: "Content",
				// showTabPrefix: "Afficher l'onglet/la colonne ",
				showTabObjective: "Show Objective tab/column",
				showTabEvent: "Show Event tab/column",
				showTabLocation: "Show Location tab/column",
				showTabCharacter: "Show Character tab/column",
				showTabNote: "Show Note tab/column",
			},
			misc: {
				title: "Other",
				openSearch: "Open/close search window",
				openOptions: "Open/close option menu",
			},
		},
	},
};
