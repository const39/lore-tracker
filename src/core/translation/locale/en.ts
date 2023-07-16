import { Locale } from "@/core/translation/translation";

const en: Locale = {
	pages: {
		loreBook: "Lore book",
		timeline: "Timeline",
	},

	notFound: {
		title: "Page Not Found",
		message: "Go back to ",
	},

	timeline: {
		campaignStart: "Campaign start",
		noEvent: "No event registered. Add some on the ",
		ascOrder: "Ascending chronological order",
		descOrder: "Descending chronological order",
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

		folder: "Folder",
		file: "File",
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
		search: "Search",
		selectors: {
			customOrder: "Custom order",
			alphanumericOrder: "Alphanumeric order",
			largeTabDensity: "Large density",
			comfortableTabDensity: "Comfortable density",
			compactTabDensity: "Compact density",
		},
	},

	sidePanel: {
		moveCard: "Move",
		folderList: "Folder list",
		openFolder: "Open",
	},

	dragAndDrop: {
		desc: "Drag & drop mode",
		modes: {
			disabled: "Disabled",
			moveToFolder: "Move to folder",
			sort: "Sort cards",
			link: "Link a card",
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
		requiredField: "Required field",
		dayNotValid: "Invalid day",
		illegalCharacters: "Name contains illegal characters",
		nameAlreadyUsed: "Name already used",
		maxCharacterCount: " characters max.",
	},

	dialogs: {
		addFolder: "New folder",
		addQuest: "New quest",
		addEvent: "New event",
		addLocation: "New location",
		addCharacter: "New character",
		addFaction: "New faction",
		addNote: "New note",

		editFolder: "Edit a folder",
		editQuest: "Edit a quest",
		editEvent: "Edit an event",
		editLocation: "Edit a location",
		editCharacter: "Edit a character",
		editFaction: "Edit a faction",
		editNote: "Edit a note",

		deleteFolder: "Delete a folder",
		deleteQuest: "Delete a quest",
		deleteEvent: "Delete an event",
		deleteLocation: "Delete a location",
		deleteCharacter: "Delete a character",
		deleteFaction: "Delete a faction",
		deleteNote: "Delete a note",
		deleteConfirm: "Do you really want to delete ",
		deleteConfirmFolder: "This will delete all its subfolders and files.",
	},

	actions: {
		close: "Close",
		save: "Save",
		yes: "Yes",
		no: "No",
		edit: "Edit",
		delete: "Delete",
		moveTo: "Move to",
		quickNote: "Quick note",
		dropCardHere: "Drop a card here",
	},

	messages: {
		success: {
			saveFileImportSuccessful: "Save file imported.",
			newCardStored: "saved",
			newCardStoredInFolder: "saved in folder",
		},
		errors: {
			genericError: "An error occurred.",
			corruptedSave: "Corrupted or incomplete save data.",
			loadBackup: "Please load a backup version to retrieve your data.",
			saveFileImportCancelled: "Save file import cancelled.",
			saveFileImportFailed: "The uploaded save file cannot be read.",
			files: {
				invalidOperation: {
					title: "Invalid operation",
				},
				folderNotFound: {
					title: "Folder not found",
					action: "Go back to the root folder",
				},
				nameAlreadyUsed: {
					title: "Name already used",
				},
			},
		},
		info: {
			updateNotifTitle: "LoreTracker has been updated!",
			updateNotifMessage: "See update details on GitHub.",
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
			deleteDialogMessage:
				"All saved data will be lost. Please consider to backup your data first.",
		},
		about: {
			optionName: "About",
			title: "About Lore Tracker",
			link: "Source code",
		},
		hotkeys: {
			optionName: "Show hotkeys",
			title: "Hotkeys",
			hold: "Hold",
			pages: {
				title: "Pages",
				toLoreBook: "Navigate to Lore Book",
				toTimeline: "Navigate to Timeline",
			},
			content: {
				title: "Content",
				showTabQuest: "Show Quest tab",
				showTabEvent: "Show Event tab",
				showTabLocation: "Show Location tab",
				showTabCharacter: "Show Character tab",
				showTabFaction: "Show Faction tab",
				showTabNote: "Show Note tab",
			},
			misc: {
				title: "Other",
				openOptions: "Open/close option menu",
			},
		},
	},
};
export default en;