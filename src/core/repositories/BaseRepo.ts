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

	add(item: M) {
		this.save(item);
	}

	update(item: PartialModel<M>) {
		this.save(item);
	}

	delete(id: UUID) {
		this.destroy(id);
	}

	changeOrder(items: Array<Indexable & Orderable>) {
		this.save(items);
	}
}
