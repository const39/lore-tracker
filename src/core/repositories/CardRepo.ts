import { Model } from "pinia-orm";
import { Categorizable, Indexable, Orderable } from "../models";
import BaseRepo from "./BaseRepo";

type Card = Model & Indexable & Orderable & Categorizable;

export default class CardRepo<M extends Card> extends BaseRepo<M> {
	override add(item: M): M {
		// If position is not specified or left to 'latest' (i.e. -1), set it to the next available position
		if (item.position === undefined || item.position === -1) {
			const latest = this.where("category", item.category)
				.orderBy("position", "desc")
				.first();

			const nextPosition = (latest?.position ?? -1) + 1; // If there is no previous card, the next position is 0
			return super.add({ ...item, position: nextPosition });
		}

		// Leave untouched if position is specified
		return super.add(item);
	}

	changeOrder(items: Array<Indexable & Orderable>) {
		return this.save(items);
	}
}
