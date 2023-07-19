import localForage from "localforage";
import { useRepo } from "pinia-orm";
import { deepCopy } from "@/core/utils/functions";
import { UUID } from "../utils/types";
import type { ORMClass } from "../models";

const DB_NAME = "lore-tracker-main-db";

/**
 * Internal cache of IndexedDB stores
 */
const dbStores = new Map<string, LocalForage>();

/**
 * Load any persisted data from the specified IndexedDB store into the model.
 * @param model the ORM model to load data into
 * @param dbStore the IndexedDB store to read data from
 */
async function loadInto(model: ORMClass, dbStore: LocalForage) {
	const repo = useRepo(model);
	await dbStore.iterate((value: Record<UUID, any>) => {
		repo.save(model.revive(value));
	});
}

/**
 * Enable auto persistence of the model's data into the specified IndexedDB store.
 * @param model the ORM model to persist the data of
 * @param dbStore the IndexedDB store to write data to
 */
function enablePersistence(model: ORMClass, dbStore: LocalForage) {
	useRepo(model)
		.piniaStore()
		.$subscribe(async (mutation, state) => {
			// Clear whole DB store first
			await dbStore.clear();
			// Store every element in the DB
			Object.entries(state.data).forEach(async ([key, val]) => {
				await dbStore.setItem(key, deepCopy(val)); // We have to clone the data to remove the Proxy wrapper around each object
			});
		});
}

/**
 * Bind an ORM Model class to a local persistence back-end.
 *
 * Binding a model to a persistence back-end enables:
 * - auto loading of the model from the persisted data on app startup
 * - auto persistence of the model after each change
 *
 * @param model the ORM class to bind
 */
export async function bind(model: ORMClass) {
	// Do nothing if model is already bound
	if (dbStores.has(model.entity)) return;

	// Create the IndexedDB store for the model
	const dbStore = localForage.createInstance({
		name: DB_NAME,
		driver: localForage.INDEXEDDB,
		storeName: `${model.entity}-store`,
	});
	// Store it in the internal cache
	dbStores.set(model.entity, dbStore);

	// Load any persisted data into the model
	await loadInto(model, dbStore);
	// Enable auto persistence of the model's data
	enablePersistence(model, dbStore);
}

/**
 * Clear any data stored within the IndexedDB stores.
 */
export async function clearPersistedData() {
	[...dbStores.values()].forEach(async (dbStore) => {
		await dbStore.clear();
	});
}
