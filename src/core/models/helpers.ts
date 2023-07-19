import { ORMClass } from "./types";
import { Campaign, Folder, LoreEntry } from ".";

export function getPersistentModels(): ORMClass[] {
	return [Campaign, Folder, LoreEntry];
}

