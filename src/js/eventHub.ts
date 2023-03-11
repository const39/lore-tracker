import { CardTypes, Tag } from "./types";

export function useEventHub() {
	type EventHandler = (...args: any[]) => void;

	const handlersMap = new Map<string, EventHandler[]>();

	function emit(event: string, ...args: any[]) {
		const handlers = handlersMap.get(event);
		handlers?.forEach((handler) => handler(...args));
	}

	function on(event: string, handler: EventHandler) {
		const handlers = handlersMap.get(event);
		if (handlers) handlers.push(handler);
		else handlersMap.set(event, [handler]);
	}

	function off(event: string, handler?: EventHandler) {
		if (handler) {
			const handlers = handlersMap.get(event);
			if (handlers) {
				const idx = handlers.findIndex((h) => h === handler);
				if (idx !== -1) handlers.splice(idx, 1);
			}
		} else handlersMap.delete(event);
	}

	return {
		emit,
		on,
		off,
	};
}

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
