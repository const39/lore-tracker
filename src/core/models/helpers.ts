import { PersistentORMClass } from "./PersistentModel";
import { Campaign, Folder, LoreEntry } from ".";

export function getPersistentModels(): PersistentORMClass[] {
	return [Campaign, Folder, LoreEntry];
}

