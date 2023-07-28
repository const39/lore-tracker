import { useRepo } from "pinia-orm";
import { Campaign, Folder, LoreEntry, StoreName, getPersistentModels } from "@/core/models";
import { clearDatabase, exportStoreData, importStoreData } from "@/core/persistence/indexed-db";
import { UUID } from "@/core/utils/types";
import { SaveVersion, convertToLatestVersion } from "./save-converter";

export enum LocalStorageKey {
	LEGACY_DATA_KEY = "DATA",
	PREFERENCES_KEY = "PREFERENCES",
}

/**
 * Metadata of a save file.
 */
export interface MetaData {
	version: SaveVersion.Latest;
	lastUpdate: string; // ISO date-time format | Format not enforced !
}

// ! On each update to to SaveFormat or its type dependencies
// * 1. Update/Create save format converter in saves.ts
// * 2. Generate the save format's JSON Schema => npm run generate-save-schema
/**
 * Data format of a save file.
 */
export interface SaveFormat {
	_meta: MetaData;
	[StoreName.Campaign]: Record<UUID, Campaign>;
	[StoreName.Folder]: Record<UUID, Folder<LoreEntry>>;
	[StoreName.LoreEntry]: Record<UUID, LoreEntry>;
}

/**
 * Load and import a save using the legacy LocalStorage method.
 *
 * This function will read the LocalStorage save content, import it into the new IndexedDB storage.
 */
export async function loadFromLegacyStorage() {
	const rawData = localStorage.getItem(LocalStorageKey.LEGACY_DATA_KEY);
	if (rawData) {
		await importSave(rawData);
		localStorage.removeItem(LocalStorageKey.LEGACY_DATA_KEY);
	}
}

/**
 * Read a JSON save and load its contents to the IndexedDB data stores.
 * The save is automatically converted to the latest format if possible.
 *
 * @param json the JSON save to import
 */
export async function importSave(json: string) {
	// Parse JSON data
	const data: Record<string, any> = JSON.parse(json);
	// Convert save to latest format (if needed)
	const converted = convertToLatestVersion(data) as Record<string, any>;
	// Delete previous data
	await deleteSave();
	// Load data into the IndexedDB database
	await Promise.all(
		Object.values(StoreName).map((name) => {
			return importStoreData(name, converted[name]);
		})
	);
}

/**
 * Export the current persisted data to a JSON data save formatted with the latest save format.
 */
export async function exportSaveToJSON(): Promise<string> {
	const mainData: Omit<SaveFormat, "_meta"> = {} as Omit<SaveFormat, "_meta">;

	// Export each data store's data
	await Promise.all(
		Object.values(StoreName).map(async (name) => {
			mainData[name] = await exportStoreData(name);
		})
	);

	// Append save metadata
	const fullData: SaveFormat = {
		...mainData,
		_meta: {
			version: SaveVersion.Latest,
			lastUpdate: new Date().toISOString(),
		},
	};

	// Convert data to JSON
	return JSON.stringify(fullData);
}

/**
 * Export the current persisted data to a JSON data save file formatted with the latest save format.
 */
export async function exportSaveToFile(): Promise<Blob> {
	const json = await exportSaveToJSON();
	// Wrap JSON in a Blob
	return new Blob([json], { type: "application/json" });
}

/**
 * Delete all data from the ORM stores as well as their persisted copy.
 */
export async function deleteSave() {
	// Clear runtime ORM stores
	getPersistentModels().forEach((orm) => {
		useRepo(orm).flush();
	});
	// Clear persisted data
	await clearDatabase();
}
