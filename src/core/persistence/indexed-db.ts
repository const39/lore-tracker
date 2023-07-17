import localForage from "localforage";
import { useRepo } from "pinia-orm";
import { deepCopy } from "@/core/utils/functions";
import type { ORMClass } from "../models";

/**
 * Internal cache of IndexedDB instances
 */
const instances = new Map<string, LocalForage>();

/**
 * Load any persisted data from the specified IndexedDB store into the model.
 * @param model the ORM model to load data into
 * @param db the IndexedDB instance to read data from
 */
async function loadInto(model: ORMClass, db: LocalForage) {
	const repo = useRepo(model);
	await db.iterate((value) => {
		repo.save(new model(value));
	});
}

/**
 * Enable auto persistence of the model's data into the specified IndexedDB store.
 * @param model the ORM model to persist the data of
 * @param db the IndexedDB instance to write data to
 */
function enablePersistence(model: ORMClass, db: LocalForage) {
	useRepo(model)
		.piniaStore()
		.$subscribe((mutation, state) => {
			Object.entries(state.data).forEach(([key, val]) => {
				db.setItem(key, deepCopy(val));	// We have to clone the data to remove the Proxy wrapper around each object
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
	if (instances.has(model.entity))
		throw new Error(`Model ${model.name} is already bound to a local persistence back-end.`);

	// Create the IndexedDB instance for the model
	const instance = localForage.createInstance({
		driver: localForage.INDEXEDDB,
		storeName: `${model.entity}-store`,
	});
	// Store it in the internal cache
	instances.set(model.entity, instance);

	// Load any persisted data into the model
	await loadInto(model, instance);
	// Enable auto persistence of the model's data
	enablePersistence(model, instance);
}
