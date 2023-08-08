import { Locale } from "@/core/translation/translation";

const en: Locale = {
	pages: {
		notFound: {
			title: "Page Not Found",
			message: "Go back to ",
		},

		campaigns: {
			name: "Campaigns",
			title: "Welcome on LoreTracker!",
			subtitle: "Your campaigns",
			table: {
				progress: "Progress",
				entryCount: "Entry count",
				lastUpdate: "Last update",
				empty: "No campaign available.",
			},
		},

		timeline: {
			name: "Timeline",
			title: "Timeline",
			content: {
				campaignStart: "Campaign start",
				noEvent: "No event registered. Add some on the ",
				ascOrder: "Ascending chronological order",
				descOrder: "Descending chronological order",
			},
		},

		loreBook: {
			name: "Lore book",
			banner: {
				statusAction: "Click to increase or decrease",
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
				relatedCards: "Cards related to",
				noRelatedCards: "No related card.",
			},

			quickNote: {
				name: "Quick note",
			},

			fields: {
				labels: {
					category: "Catégorie",
					name: "Name",
					title: "Title",
					desc: "Description",
					tags: "Tags",
					noTag: "No tag",
					mdSupport: "Markdown language supported",
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
				},
				content: {
					unknownRace: "Unknown race",
					unknownClass: "Unknown class",
					unknownRole: "Unknown role",
				},
				errors: {
					requiredField: "Required field",
					dayNotValid: "Invalid day",
					illegalCharacters: "Name contains illegal characters",
					nameAlreadyUsed: "Name already used",
					maxCharacterCount: ({ n }) => `${n} characters max.`,
				},
			},
		},
	},

	data: {
		campaign: {
			name: ["No campaign", "Campaign", "Campaigns"],
			day: "Day",
			entryCount: ["No entries", "entry", "entries"],
			seasons: {
				spring: "Spring",
				summer: "Summer",
				autumn: "Autumn",
				winter: "Winter",
			},
		},
		categories: {
			quest: ["No quests", "Quest", "Quests"],
			event: ["No events", "Event", "Events"],
			location: ["No locations", "Location", "Locations"],
			character: ["No characters", "Character", "Characters"],
			faction: ["No factions", "Faction", "Factions"],
			note: ["No notes", "Note", "Notes"],
		},
		eventTypes: {
			combat: "Combat",
			encounter: "Encounter",
			discovery: "Discovery",
			travel: "Travel",
			other: "Other",
		},
		cardTypes: {
			folder: ["No folders", "Folder", "Folders"],
			file: ["No files", "File", "Files"],
		},
	},

	dialogs: {
		addCampaign: "New campaign",
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

		deleteCampaign: "Delete a campaign",
		deleteFolder: "Delete a folder",
		deleteQuest: "Delete a quest",
		deleteEvent: "Delete an event",
		deleteLocation: "Delete a location",
		deleteCharacter: "Delete a character",
		deleteFaction: "Delete a faction",
		deleteNote: "Delete a note",
		deleteConfirm: "Do you really want to delete ",
		deleteConfirmFolder: "This will delete all its subfolders and files.",
		deleteConfirmCampaign: "This will delete all its entries.",
	},

	actions: {
		close: "Close",
		save: "Save",
		yes: "Yes",
		no: "No",
		showRelated: "See related tags",
		edit: "Edit",
		delete: "Delete",
		moveTo: "Move to",
		dropCardHere: "Drop a card here",
		dragSort: "Sort cards",
		multipleDragItems: "elements",
	},

	messages: {
		success: {
			saveFileImportSuccessful: "Save file imported.",
			newCardStored: "saved",
			newCardStoredInFolder: "saved in folder",
		},
		errors: {
			genericError: "An error occurred.",
			save: {
				corruptedSave: "Corrupted or incomplete save data.",
				loadBackup: "Please load a backup version to retrieve your data.",
				saveFileImportCancelled: "Save file import cancelled",
				saveFileImportFailed: "The uploaded save file cannot be read.",
			},
			campaign: {
				campaignNotFound: {
					title: "Campaign not found",
					action: "Go back to the campaign list",
				},
			},
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
			sidePanel: {
				formAlreadyOpen: {
					title: "Cannot open the side panel: a form is already open.",
				},
			},
		},
		info: {
			updateNotif: {
				title: "LoreTracker has been updated!",
				message: "See update details on GitHub.",
			},
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
			content: {
				title: "Content",
				showTab: ({ category }) => `Show ${category} tab`,
			},
			misc: {
				title: "Other",
				openOptions: "Toggle options menu",
			},
		},
	},
};
export default en;
