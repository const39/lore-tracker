import { useEventListener } from "@vueuse/core";
import { Ref, ref } from "vue";

interface Options {
	acceptMIME?: string[];
}

export type Operation = Exclude<typeof DataTransfer.prototype.dropEffect, "none">;

export type Status = "idle" | "accepted" | "rejected";

export function useDropZone(
	target: Ref<HTMLElement | null | undefined>,
	operation: Operation,
	onDropAccepted: (data: Array<File | string | null>) => void,
	options?: Options
) {
	const { acceptMIME } = options ?? {};

	const mimeTypes = acceptMIME?.map((type) => type.toLowerCase());

	const status = ref<Status>("idle");
	let counter = 0;

	function _isAccepted(dataTransfer: DataTransfer) {
		if (dataTransfer.items.length) {
			if (!mimeTypes) return true;
			else {
				for (let i = 0; i < dataTransfer.items.length; i++) {
					const item = dataTransfer.items[i];
					if (!mimeTypes.includes(item.type.toLowerCase())) return false;
				}
			}
		}
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
				promises.push(
					new Promise<File | string | null>((resolve) => {
						if (item.kind === "string") item.getAsString((str) => resolve(str));
						else if (item.kind === "file") resolve(item.getAsFile());
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
