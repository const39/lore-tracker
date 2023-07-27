import * as idb from "idb";
import { StoreName } from "../models";
import { Maybe, UUID } from "../utils/types";
import { SaveVersion, getSaveVersionNumber } from "./save-converter";
import { CRUDAdapter } from ".";

/**
 * CRUD adapter for an IndexedDB persistence backend.
 */
export class IndexedDBAdapter<T = unknown> implements CRUDAdapter<T> {
	/**
	 * Create an IndexedDB adapter.
	 *
	 * @param db the IndexedDB database
	 * @param storeName the name of the store that saves the data
	 */
	constructor(public db: idb.IDBPDatabase, public storeName: StoreName) {}

	read(key: UUID): Promise<Maybe<T>> {
		return this.db.get(this.storeName, key);
	}

	readAll(): Promise<Maybe<T[]>> {
		return this.db.getAll(this.storeName);
	}

	async create(key: UUID, item: T): Promise<void> {
		await this.db.add(this.storeName, item, key);
	}

	async update(key: UUID, item: T): Promise<void> {
		await this.db.put(this.storeName, item, key);
	}

	delete(key: UUID): Promise<void> {
		return this.db.delete(this.storeName, key);
	}
}

const DB_NAME = "lore-tracker-main-db";

// Open a connection to the IndexedDB database
// -> Starts at v3 (because IndexedDB was setup from Save-v3 onward)
export const database = await idb.openDB(DB_NAME, getSaveVersionNumber(SaveVersion.v3), {
	upgrade(database, oldVersion, newVersion) {
		console.info(`Upgrading IndexedDB database from v${oldVersion} to v${newVersion}...`);

		// Save-v3
		database.createObjectStore(StoreName.Campaign);
		database.createObjectStore(StoreName.Folder);
		database.createObjectStore(StoreName.LoreEntry);
	},
	blocked(currentVersion, blockedVersion) {
		console.error(
			`This IndexedDB database is already open on an older version (v${currentVersion}) in another page. Waiting the other page to be closed before upgrading to v${blockedVersion}...`
		);
		alert("Please close all other open LoreTracker tabs. Save migration in progress...");
	},
	blocking(currentVersion, blockedVersion) {
		console.error(
			`Another page attempts to upgrade this IndexedDB database to v${blockedVersion}. It is currently open on v${currentVersion}.`
		);
		alert("A new version of this page is ready. Please reload or close this tab.");
	},
});

/**
 * Import records into the specified IndexedDB store.
 *
 * This loads all records in a unique transaction. It is meant to be used to import a large batch of data at once, usually during a save load.
 *
 * @param storeName the name of the store to save the records into
 * @param records the records to save into the store
 */
export async function importStoreData(
	storeName: StoreName,
	records: Record<UUID, any>
): Promise<void> {
	const transaction = database.transaction(storeName, "readwrite");

	// Load each record into the store
	const operations = Object.entries(records).map(([key, value]) => {
		return transaction.store.put(value, key);
	});

	// Perform the transaction operations
	await Promise.all([...operations, transaction.done]);
}

/**
 * Export all records saved into the specified IndexedDB store.
 *
 * @param storeName the name of the store to export the records from
 *
 * @returns a dictionary-like object containing all the records, where each record is accessible by its key
 */
export async function exportStoreData(storeName: StoreName): Promise<Record<UUID, any>> {
	const items: Record<UUID, any> = {};
	const transaction = database.transaction(storeName, "readonly");
	let cursor = await transaction.objectStore(storeName).openCursor();
	// Iterate over each record
	while (cursor) {
		// Ignore records that are not indexed by a string key
		if (typeof cursor.key === "string") {
			items[cursor.key] = cursor.value;
		}
		cursor = await cursor.continue();
	}
	return items;
}

/**
 * Clear all records stored within the specified IndexedDB store.
 *
 * @param storeName the name of the store to clear the records from
 */
export async function clearStoreData(storeName: StoreName): Promise<void> {
	await database.clear(storeName);
}

/**
 * Clear the IndexedDB database from all its data.
 */
export async function clearDatabase() {
	await Promise.all(Object.values(StoreName).map(clearStoreData));
}
