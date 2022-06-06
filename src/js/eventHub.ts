import Vue from "vue";
import { CardTypes, Tag } from "./types";

export const eventHub = new Vue();

export class CardEvent {
	card: CardTypes;
	constructor(card: CardTypes) {
		this.card = card;
	}
}

export class TagEvent {
	tag: Tag;
	constructor(tag: Tag) {
		this.tag = tag;
	}
}
