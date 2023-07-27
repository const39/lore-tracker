import { Model } from "pinia-orm";
import { CRUDAdapter } from "../persistence";
import { deepCopy } from "../utils/functions";
import { MaybePromise, UUID } from "../utils/types";
import { ORMClass } from "./types";

/**
 * Interface describing the structure of the {@link PersistentModel} class (i.e. static properties).
 */
export interface PersistentORMClass extends ORMClass {
	loadFromBackend(loader: (item: Record<UUID, any>) => MaybePromise<void>): MaybePromise<void>;
	persistenceBackend: CRUDAdapter<PersistentModel>;
	persist: boolean;
}

export class PersistentModel extends Model {
	public static persistenceBackend: CRUDAdapter<PersistentModel>;

	public static persist = true;

	private static throwPersistenceWarning() {
		try {
			throw new Error("Cannot persist model data. Cause: no defined persistence backend.");
		} catch (e) {
			console.warn(e);
		}
	}

	/**
	 * Load persisted data from the current persistence backend.
	 * @param loader a loading function call with each persisted item. This function should revive the persisted item to a Model instance and save it to its related ORM store.
	 */
	static async loadFromBackend(
		loader: (item: Record<UUID, any>) => MaybePromise<void>
	): Promise<void> {
		if (!this.persistenceBackend)
			throw new Error(
				"Cannot load data from the persistence backend. Cause: no defined persistence backend."
			);

		// Disable temporarily the auto persistence during data loading to avoid re-writing the data we're reading
		this.persist = false;

		// Revive every stored item and load them into the ORM store
		const items = await this.persistenceBackend.readAll();
		if (items?.length) await Promise.all(items.map(loader));

		this.persist = true;
	}

	// Hook called when a new item is saved
	static async created(model: PersistentModel) {
		if (this.persist) {
			if (!this.persistenceBackend) return this.throwPersistenceWarning();
			await this.persistenceBackend.create(model.id, deepCopy(model)); // Deep clone item to remove any Proxy object (because Proxy is not natively serializable)
		}
	}

	// Hook called when an item is updated
	static async updated(model: PersistentModel) {
		if (this.persist) {
			if (!this.persistenceBackend) return this.throwPersistenceWarning();
			await this.persistenceBackend.update(model.id, deepCopy(model)); // Deep clone item to remove any Proxy object (because Proxy is not natively serializable)
		}
	}

	// Hook called when an item is deleted
	static async deleted(model: PersistentModel) {
		if (this.persist) {
			if (!this.persistenceBackend) return this.throwPersistenceWarning();
			await this.persistenceBackend.delete(model.id);
		}
	}
}
