import Vue from "vue";
import { CardTypes, Tag } from "./types";

export const eventHub = new Vue();

export class CardEvent {
	static ID = "delete-card";
	constructor(public card: CardTypes) {}
}

export class TagEvent {
	static ID = "select-tag";
	constructor(public tag: Tag) {}
}

export class SnackbarEvent {
	static ID = "show-snackbar";
	constructor(public message: string, public timeout: number, public color: string) {}
}
