import { CardFolder, CardTypes, isCardFolder } from "./model/cards";

export enum Icon {
	// Card types
	quest = "mdi-star-circle",
	event = "mdi-sword-cross",
	location = "mdi-home",
	character = "mdi-account",
	faction = "mdi-crown",
	note = "mdi-note-text",
	// Event card
	combat = "mdi-sword-cross",
	encounter = "mdi-account-group",
	discovery = "mdi-magnify",
	travel = "mdi-horseshoe",
	other = "mdi-help",
	// Quest card
	questCompleted = "mdi-check-decagram",
	taskCompleted = "mdi-star-check",
	taskOngoing = "mdi-star-outline",
	// Folder
	folder = "mdi-folder",
	// Snackbar 
	error = "mdi-close-circle",
	warning = "mdi-alert",
	info = "mdi-information",
	success = "mdi-check-circle",
}

export function getIcon(content: CardTypes | CardFolder): Icon {
	if (isCardFolder(content)) return Icon.folder;
	if (content._category === "event") return Icon[content.type];
	else return Icon[content._category];
}
