import { CardFolder, CardTypes, isCardFolder } from "./model/cards";

export enum Icon {
	quest = "mdi-star-circle",
	event = "mdi-sword-cross",
	location = "mdi-home",
	character = "mdi-account",
	faction = "mdi-crown",
	note = "mdi-note-text",
	combat = "mdi-sword-cross",
	encounter = "mdi-account-group",
	discovery = "mdi-magnify",
	travel = "mdi-horseshoe",
	other = "mdi-help",
	questCompleted = "mdi-check-decagram",
	taskCompleted = "mdi-star-check",
	taskOngoing = "mdi-star-outline",
	folder = "mdi-folder",
}

export function getIcon(content: CardTypes | CardFolder): Icon {
	if (isCardFolder(content)) return Icon.folder;
	if (content._category === "event") return Icon[content.type];
	else return Icon[content._category];
}
