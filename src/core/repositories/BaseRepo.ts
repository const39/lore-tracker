import { Model, Repository } from "pinia-orm";
import { Indexable, Orderable } from "../models";
import { UUID } from "../utils/types";

export interface QueryOptions {
	shallow?: boolean;
}

export type PartialModel<T extends Model> = Partial<T> & Indexable;

export default class BaseRepo<M extends Model> extends Repository<M> {
	protected createQuery(options?: QueryOptions) {
		const query = this.query();
		if (!options?.shallow) query.withAll();
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

	changeOrder(items: Array<Indexable & Orderable>) {
		return this.save(items);
	}
}
