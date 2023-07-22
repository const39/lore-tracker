import { MaybeElementRef, unrefElement, useEventListener } from "@vueuse/core";
import { Ref, ref } from "vue";
import utilities from "@/core/utils/functions";
import { DragAndDropMode, useDragAndDropMode } from "@/store/dragAndDropMode";

type DragAndDropID = string;
type DragAndDropData = any;

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
	acceptMode?: DragAndDropMode[];
}

export interface DropPayload<T = unknown> {
	dataType: CustomMIMEType | string;
	data: T;
}

export enum CustomMIMEType {
	DragAndDropID = "application/drag-and-drop-id",
	LoreEntry = "application/lore-entry",
	Folder = "application/folder",
}

const compoundMIMETypes = {
	create(referencedType: CustomMIMEType | string) {
		return `${CustomMIMEType.DragAndDropID}:${referencedType}`;
	},
	detect(str: string) {
		return str.trim().startsWith(CustomMIMEType.DragAndDropID + ":");
	},
	extract(str: string) {
		return this.detect(str)
			? str.replace(CustomMIMEType.DragAndDropID + ":", "").trim()
			: undefined;
	},
};

export type Operation = Exclude<typeof DataTransfer.prototype.dropEffect, "none">;

export type Status = "idle" | "accepted" | "rejected";

const buffer = new Map<DragAndDropID, DragAndDropData>();

export function startDrag(
	e: DragEvent,
	data: any,
	dataType: CustomMIMEType | string,
	options?: DragOptions
) {
	if (e.dataTransfer) {
		const ID = "drag-" + utilities.uid();
		buffer.set(ID, data);
		e.dataTransfer.setData(compoundMIMETypes.create(dataType), ID);

		// Set drag image if specified
		if (options?.dragImage) {
			const { image, offsetX, offsetY } = options.dragImage;
			const img = unrefElement(image);
			if (img) e.dataTransfer.setDragImage(img, offsetX, offsetY);
		}
	}
}

export function useDropZone<T>(
	target: Ref<HTMLElement | null | undefined>,
	operation: Operation,
	onDropAccepted: (items: DropPayload<T>[]) => void,
	options?: DropOptions
) {
	const _dndStore = useDragAndDropMode();

	const acceptedMIMETypes = options?.acceptMIME
		? [...options.acceptMIME, CustomMIMEType.DragAndDropID].map((type) => type.toLowerCase())
		: undefined;

	const status = ref<Status>("idle");
	let counter = 0;

	function _isAccepted(dataTransfer: DataTransfer) {
		if (dataTransfer.items.length) {
			// If there is no requirement for MIME types, accept all by default
			if (!acceptedMIMETypes) return true;
			else {
				// Browse through the items' dataTypes and reject if any of them is not accepted
				for (let i = 0; i < dataTransfer.items.length; i++) {
					const item = dataTransfer.items[i];
					const dataType = compoundMIMETypes.extract(item.type) ?? item.type;

					if (!acceptedMIMETypes.includes(dataType.toLowerCase())) return false;
				}
			}
		}

		// Reject if current drag & drop mode is not among the accepted ones
		if (options?.acceptMode && !options.acceptMode.includes(_dndStore.mode)) return false;

		return true;
	}

	function onDragEnter(e: DragEvent) {
		e.preventDefault();
		counter++;
		if (e.dataTransfer) status.value = _isAccepted(e.dataTransfer) ? "accepted" : "rejected";
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
		if (e.dataTransfer && _isAccepted(e.dataTransfer)) {
			const promises = [];
			for (let i = 0; i < e.dataTransfer.items.length; i++) {
				const item = e.dataTransfer.items[i];
				const isCompound = compoundMIMETypes.detect(item.type);
				const dataType = compoundMIMETypes.extract(item.type) ?? item.type;
				promises.push(
					new Promise<DropPayload<T>>((resolve) => {
						if (item.kind === "string")
							item.getAsString((str) => {
								const data = isCompound ? buffer.get(str) : str;
								resolve({ dataType, data });
							});
						else if (item.kind === "file")
							resolve({ dataType, data: item.getAsFile() as T });
					})
				);
			}

			Promise.all(promises).then(onDropAccepted);
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
