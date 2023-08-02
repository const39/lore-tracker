import { MaybeElementRef, unrefElement, useEventListener } from "@vueuse/core";
import { Ref, ref } from "vue";
import utilities from "@/core/utils/functions";
import { UUID } from "@/core/utils/types";

interface DragOptions {
	/**
	 * A custom drag image to use
	 * @see DataTransfer.setDragImage
	 */
	dragImage?: {
		image: MaybeElementRef;
		offsetX: number;
		offsetY: number;
	};
}

interface DropOptions {
	acceptMIME?: string[];
}

export interface DragItem<T = unknown> {
	dataType: CustomMIMEType | string;
	data: T;
}

export enum CustomMIMEType {
	DragAndDropID = "application/drag-and-drop-id",
	LoreEntry = "application/lore-entry",
	Folder = "application/folder",
}

export type Operation = Exclude<typeof DataTransfer.prototype.dropEffect, "none">;

export type Status = "idle" | "accepted" | "rejected";

const buffer = new Map<UUID, DragItem[]>();

export function startDrag(e: DragEvent, items: DragItem[], options?: DragOptions) {
	if (e.dataTransfer) {
		// Store the drag items into an internal buffer
		const ID = "drag-" + utilities.uuid();
		buffer.set(ID, items);
		// Only transfer the drag operation's ID via HTML5 Drag & Drop API
		e.dataTransfer.setData(CustomMIMEType.DragAndDropID, ID);

		// Set drag image if specified
		if (options?.dragImage) {
			const { image, offsetX, offsetY } = options.dragImage;
			const img = unrefElement(image);
			if (img) e.dataTransfer.setDragImage(img, offsetX, offsetY);
		}
	}
}

export function useDropZone(
	target: Ref<HTMLElement | null | undefined>,
	operation: Operation,
	onDropAccepted: (items: DragItem[]) => void,
	options?: DropOptions
) {
	const acceptedMIMETypes = options?.acceptMIME
		? [...options.acceptMIME, CustomMIMEType.DragAndDropID].map((type) => type.toLowerCase())
		: undefined;

	const status = ref<Status>("idle");
	let counter = 0;

	function _isAccepted(dragAndDropID: UUID) {
		// If there is no requirement for MIME types, accept all by default
		if (!acceptedMIMETypes) return true;

		// Browse through the items' dataTypes and reject if any of them is not accepted
		const items = buffer.get(dragAndDropID) ?? [];
		return items.every((item) => {
			return acceptedMIMETypes.includes(item.dataType.toLowerCase());
		});
	}

	function onDragEnter(e: DragEvent) {
		e.preventDefault();
		counter++;
		if (e.dataTransfer) {
			const ID = e.dataTransfer.getData(CustomMIMEType.DragAndDropID);
			status.value = _isAccepted(ID) ? "accepted" : "rejected";
		}
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer)
			e.dataTransfer.dropEffect = status.value === "accepted" ? operation : "none";
	}

	function onDragLeave(e: DragEvent) {
		e.preventDefault();
		counter--;
		if (counter === 0) status.value = "idle";
	}

	/**
	 * Callback triggered when the user releases the click (i.e. drops the item) in the drop zone
	 */
	function onDrop(e: DragEvent) {
		e.preventDefault();
		counter = 0;
		status.value = "idle";
		const ID = e.dataTransfer?.getData(CustomMIMEType.DragAndDropID);
		if (ID && _isAccepted(ID)) {
			const items = buffer.get(ID) ?? [];
			// Call drop handler with accepted items
			onDropAccepted(items);
		}
	}

	useEventListener(target, "dragenter", onDragEnter);
	useEventListener(target, "dragover", onDragOver);
	useEventListener(target, "dragleave", onDragLeave);
	useEventListener(target, "drop", onDrop);

	return {
		status,
	};
}
