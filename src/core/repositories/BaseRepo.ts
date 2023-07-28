import { Model, Repository } from "pinia-orm";
import { Indexable } from "../models";
import { UUID } from "../utils/types";

export interface QueryOptions {
	/**
	 * If truthy, will query the record's relations as well.
	 * If a number, the value is used as the query's recursive relation depth.
	 * If a true boolean, uses 1 as relation depth.
	 */
	withRelations?: boolean | number;
}

export type PartialModel<T extends Model> = Partial<T> & Indexable;

export default class BaseRepo<M extends Model> extends Repository<M> {
	protected createQuery(options?: QueryOptions) {
		const { withRelations } = options ?? {};
		const query = this.query();

		// If set, query the record's relations as well (use 1 level of depth if none is given)
		if (withRelations) query.withAllRecursive(withRelations === true ? 1 : withRelations);

		return query;
	}

	exists(id: UUID): boolean {
		return !!this.find(id);
	}

	add(item: M): M {
		if (this.exists(item.id))
			throw new Error(`Cannot add item: an item of ID ${item.id} already exists.`);

		return this.save(item);
	}

	update(item: PartialModel<M>): M {
		if (!this.exists(item.id))
			throw new Error(`Cannot update item: no existing item with ID ${item.id}.`);

		return this.save(item);
	}

	delete(id: UUID): void {
		if (!this.exists(id))
			throw new Error(`Cannot delete item: no existing item with ID ${id}.`);

		this.destroy(id);
	}
}
