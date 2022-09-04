import { Locale } from "@/js/translation";

const en: Locale = {
	pages: {
		home: "Home",
		timeline: "Timeline",
	},

	notFound: {
		title: "Page Not Found",
		message: "Go back to ",
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

	categories: {
		all: "Any",
		quest: "Quest",
		event: "Event",
		location: "Location",
		character: "Character",
		faction: "Faction",
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
		cardCount: " saved cards",
		selectors: {
			customOrder: "Custom order",
			alphanumericOrder: "Alphanumeric order",
			tabLayout: "Tab layout",
			columnLayout: "Column layout",
		},
	},

	fields: {
		category: "Catégorie",
		name: "Name",
		title: "Title",
		desc: "Description",
		tags: "Tags",
		noTag: "No tag",
		mdSupport: "Markdown language supported",
		otherCounter: " other",
		tasks: "Tasks",
		noTask: "No task",
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
		addQuest: "Add a quest",
		addEvent: "Add an event",
		addLocation: "Add a location",
		addCharacter: "Add a character",
		addFaction: "Add a faction",
		addNote: "Add a note",

		deleteTitle: "Delete ",
		deleteQuest: "Do you really want to delete this quest ?",
		deleteEvent: "Do you really want to delete this event ? This will also change the timeline.",
		deleteLocation: "Do you really want to delete this location ?",
		deleteCharacter: "Do you really want to delete this character ?",
		deleteFaction: "Do you really want to delete this faction ?",
		deleteNote: "Do you really want to delete this note ?",
	},

	search: {
		search: "Search",
		containing: "Containing",
		taggedWith: "Tagged with",
		cardsMatching: " cards match the search.",
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
		changeCategory: "Click or Ctrl+Left/Right to change category",
	},

	messages: {
		success: {
			saveFileImportSuccessful: "Save file imported.",
		},
		errors: {
			corruptedSave: "Corrupted or incomplete save data.",
			loadBackup: "Please load a backup version to retrieve your data.",
			saveFileImportCancelled: "Save file import cancelled.",
			saveFileImportFailed: "The uploaded save file cannot be read.",
		},
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
		save: {
			optionName: "Manage save",
			downloadText: "Download save file",
			uploadText: "Load save file",
			uploadInputLabel: "Upload file",
			uploadInputHint: "JSON file required",
			deleteText: "Delete save",
			deleteDialogTitle: "Delete save?",
			deleteDialogMessage: "All saved data will be lost. Please consider to backup your data first.",
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
				showTabQuest: "Show Quest tab/column",
				showTabEvent: "Show Event tab/column",
				showTabLocation: "Show Location tab/column",
				showTabCharacter: "Show Character tab/column",
				showTabFaction: "Show Faction tab/column",
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
export default en;
