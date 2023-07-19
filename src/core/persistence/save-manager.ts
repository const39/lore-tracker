import { useRepo } from "pinia-orm";
import { ID } from "../model/cards";
import {
	Campaign,
	Folder,
	LoreEntry,
	campaignEntityName,
	folderEntityName,
	getPersistentModels,
	loreEntryEntityName
} from "../models";
import { clearPersistedData } from "./indexed-db";
import converter, { SaveVersion } from "./save-converter";

/**
 * Metadata of a save file.
 */
export interface MetaData {
	version: SaveVersion.Latest;
	lastUpdate: string; // ISO date-time format | Format not enforced !
}

/**
 * Data format of a save file.
 */
export interface SaveFormat {
	_meta: MetaData;
	[campaignEntityName]: Record<ID, Campaign>;
	[folderEntityName]: Record<ID, Folder<LoreEntry>>;
	[loreEntryEntityName]: Record<ID, LoreEntry>;
}

/**
 * Read a JSON save and load its contents into the ORM data stores.
 * The save is automatically converted to the latest format if possible.
 *
 * @param json the JSON save to import
 */
export async function importSave(json: string) {
	// Parse JSON data
	const data: Record<string, any> = JSON.parse(json);
	// Convert save to latest format (if needed)
	const converted = converter.ensureLatestVersion(data) as Record<string, any>;
	// Delete previous data
	await deleteSave();
	// Load data into the ORM stores
	getPersistentModels().forEach((orm) => {
		const repo = useRepo(orm);
		const items = converted[orm.entity];
		for (const key in items) {
			const item = items[key];
			repo.save(orm.revive(item));
		}
	});
}

/**
 * Export the current ORM data stores to a JSON data save formatted with the latest save format.
 *
 * @param options export options
 * - asFile: whether to wrap the exported JSON data in a Blob, ready to be exported as a file
 */
export function exportSave(options?: { asFile: boolean }): Blob | string {
	// Fetch the persistent models content
	const mainData: Omit<SaveFormat, "_meta"> = {} as Omit<SaveFormat, "_meta">;
	getPersistentModels().forEach((orm) => {
		mainData[orm.entity as keyof typeof mainData] = useRepo(orm).piniaStore().data;
	});

	// Append save metadata
	const fullData: SaveFormat = {
		...mainData,
		_meta: {
			version: SaveVersion.Latest,
			lastUpdate: new Date().toISOString(),
		},
	};

	// Convert data to JSON
	const json = JSON.stringify(fullData);

	// Wrap JSON in a Blob if requested
	return options?.asFile ? new Blob([json], { type: "application/json" }) : json;
}

/**
 * Delete all data from the ORM stores as well as their persisted copy.
 */
export async function deleteSave() {
	getPersistentModels().forEach((orm) => {
		useRepo(orm).flush();
	});
	await clearPersistedData();
}
