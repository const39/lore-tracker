import { useRepo } from "pinia-orm";
import {
	Campaign,
	Category,
	ICampaign,
	IFolder,
	ILoreEntry,
	StoreName,
	getPersistentModels
} from "@/core/models";
import { clearDatabase, exportStoreData, importStoreData } from "@/core/persistence/indexed-db";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import { LocalisableError } from "../error";
import { CampaignRepo, FolderRepo } from "../repositories";
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
	[StoreName.Campaign]: Record<UUID, ICampaign>;
	[StoreName.Folder]: Record<UUID, IFolder>;
	[StoreName.LoreEntry]: Record<UUID, ILoreEntry>;
}

export class SaveFileError extends LocalisableError {
	override toLocaleString(): string {
		return $t("messages.errors.saveFileImportFailed");
	}
}

/**
 * Read a JSON save and load its contents to the IndexedDB data stores.
 * The save is automatically converted to the latest format if possible.
 *
 * @param json the JSON save to import
 *
 * @throws {SaveFileError} if the save cannot be read due to a bad encoding or file format
 * @throws {SaveFormatError} if the save cannot be used or converted due to an invalid format
 */
export async function importSave(json: string) {
	try {
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
	} catch (e) {
		// If the file could not be parsed as JSON, wrap the error in a custom SaveFileError
		if (e instanceof SyntaxError)
			throw new SaveFileError("Invalid save file encoding/format.", { cause: e });
		// If another error happened, pass it through
		throw e;
	}
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

/**
 * Load and import a save using the legacy LocalStorage method.
 *
 * This function will read the LocalStorage save content, import it into the new IndexedDB storage.
 *
 * @throws {SaveFileError} if the save cannot be read due to a bad encoding or file format
 * @throws {SaveFormatError} if the save cannot be used or converted due to an invalid format
 * @see {@link importSave()}
 */
export async function loadFromLegacyStorage() {
	const rawData = localStorage.getItem(LocalStorageKey.LEGACY_DATA_KEY);
	if (rawData) {
		await importSave(rawData);
		localStorage.removeItem(LocalStorageKey.LEGACY_DATA_KEY);
	}
}

/**
 * Load the current data save and initialise the ORM data stores with it.
 *
 * @throws {SaveFileError} if the save cannot be read due to a bad encoding or file format
 * @throws {SaveFormatError} if the save cannot be used or converted due to an invalid format
 * @see {@link loadFromLegacyStorage()}
 */
export async function loadSavedData() {
	// Transfer any previous save file stored in LocalStorage (legacy method) to IndexedDB
	await loadFromLegacyStorage();

	// Load records stored in the IndexedDB back-end in the runtime ORM stores
	await Promise.all(
		getPersistentModels().map((orm) => {
			const repo = useRepo(orm);
			return orm.loadFromBackend((item) => {
				// Revive each stored item to a runtime ORM instance and save it its related ORM store
				repo.save(orm.revive(item));
			});
		})
	);

	// Create a campaign if there is none
	const campaignRepo = useRepo(CampaignRepo);
	if (!campaignRepo.getCurrentCampaign()) {
		campaignRepo.add(new Campaign());
	}

	// Create any missing category's root folder
	const folderRepo = useRepo(FolderRepo);
	Object.values(Category).forEach((category) => {
		if (!folderRepo.getRootFolder(category)) {
			folderRepo.createRootFolder(category);
		}
	});
}
