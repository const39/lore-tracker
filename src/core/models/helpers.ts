import { BaseLoreEntry } from "./BaseLoreEntry";
import { Campaign } from "./Campaign";
import { Folder } from "./Folder";
import { ORMClass } from "./types";

export function getPersistentModels(): ORMClass[] {
	return [Campaign, Folder, BaseLoreEntry];
}
