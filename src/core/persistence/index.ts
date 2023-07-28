import { Maybe, MaybePromise, UUID } from "../utils/types";

/**
 * Functionality contract to be implemented by an adapter class providing CRUD operations support.
 */
export interface CRUDAdapter<T> {
	// * Create
	/**
	 * Create a new item.
	 * @param key the item's key
	 * @param value the item's value
	 */
	create(key: UUID, value: T): MaybePromise<void>;

	// * Read
	/**
	 * Read an item indexed by its key.
	 * @param key the item's key
	 * @returns the item's value if it exists, or an empty value otherwise.
	 */
	read(key: UUID): MaybePromise<Maybe<T>>;

	/**
	 * Read all items.
	 * @returns a list of item values if there is any, or an empty value otherwise.
	 */
	readAll(): MaybePromise<Maybe<T[]>>;

	// * Update
	/**
	 * Update the item indexed by the specified key.
	 * @param key the item's key
	 * @param value the item's value
	 */
	update(key: UUID, value: T): MaybePromise<void>;

	// * Delete
	/**
	 * Delete the item indexed by the specified key.
	 *
	 * In case no item is located at the specified key, this function's behavior is unspecified and left to implementation details.
	 *
	 * @param key the item's key
	 */
	delete(key: UUID): MaybePromise<void>;
}

export * from "./indexed-db";
