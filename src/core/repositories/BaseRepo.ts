import { Model, Repository } from "pinia-orm";
import { UUID } from "../utils/types";

export type PartialModel<T extends Model> = Partial<T> & { id: UUID };

export default class BaseRepo<M extends Model> extends Repository<M> {
	add(item: M) {
		this.save(item);
	}

	update(item: PartialModel<M>) {
		this.save(item);
	}

	delete(id: UUID) {
		this.destroy(id);
	}
}
