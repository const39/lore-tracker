import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
	CardCategory,
	CardFolder,
	CardFolderMetadata,
	CardTypeBasedOnCategory,
	CardTypes,
	CardsStore,
	CardsStoreSerialized,
	ID,
	createRootFolder,
} from "@/core/model/cards";
import { FileError, FileErrorCodes, Path } from "@/core/model/fileTree";
import { SerializedState } from ".";

function defaultCards(): CardsStore {
	// Generate automatically the CardsStore using the CardCategory enum values as keys
	const cards = {} as CardsStore;
	for (const category of Object.values(CardCategory)) {
		// @ts-ignore - Ignore TS error because it is not able to deduce the type associated to the current category
		cards[category] = createRootFolder(category);
	}
	return cards;
}

export const useCardsStore = defineStore("cards", () => {
	const cards = ref(defaultCards());

	const currentCategory = ref<CardCategory>(CardCategory.Quest);
	const currentFolderPath = ref<Path>(new Path());

	const currentFolder = computed(() => {
		const root = getCategoryFolder(currentCategory.value);
		// Safeguard - If folder does not exist, set current folder to root
		// -> this should not happen because setCurrentFolder() throws an error if folder does not exist
		return root.getFolderByPath(currentFolderPath.value) ?? root;
	});

	const serializableState = computed(() => {
		const serializedCards = {} as CardsStoreSerialized;
		for (const category of Object.values(CardCategory)) {
			//@ts-ignore - Ignore TS error because it is not able to deduce the type associated to the current category
			serializedCards[category] = _getFlatTree(category);
		}
		return { cards: serializedCards };
	});

	/**
	 * Set the current folder to folderPath in the specified category.
	 * @param category the category of the root folder
	 * @param folderPath an optional path to the target folder. Will use the root folder as current folder if not specified.
	 * @throws if the specified folderPath does not resolve to an existing folder in the category root folder
	 */
	function setCurrentFolder(category: CardCategory, folderPath?: Path) {
		const rootFolder = getCategoryFolder(category);
		const path = folderPath ? folderPath : new Path();
		const exists = rootFolder.hasFolder(path);
		if (exists) {
			currentCategory.value = category;
			currentFolderPath.value = path;
		} else
			throw new FileError(
				FileErrorCodes.FolderNotFound,
				`Folder at path ${folderPath} in category '${category}' not found.`
			);
	}

	function _getFlatTree<T extends CardCategory>(category: T) {
		return getCategoryFolder(category).serialize();
	}

	function getAllFolders<T extends CardCategory>(category: T) {
		const flat = _getFlatTree(category);
		return Object.keys(flat).map((key) => flat[key]);
	}

	function getAllFiles<T extends CardCategory>(category: T) {
		return getAllFolders(category).flatMap(
			(folder) => folder.files as CardTypeBasedOnCategory<T>[]
		);
	}

	function getCategoryFolder<T extends CardCategory>(category: T) {
		return cards.value[category];
	}

	function findFileInFolder(id: ID, folder: CardFolder) {
		return folder.getFile(id);
	}

	/**
	 * Search the file with the specified ID in all category root folders.
	 * @param id the file ID
	 * @returns the file or undefined if it is not found
	 */
	function findFile(id: ID) {
		for (const key in cards.value) {
			const ret = findFileInFolder(id, getCategoryFolder(key as CardCategory));
			if (ret) return ret;
		}
		return undefined;
	}

	function addFolder(folder: CardFolder, inFolder?: CardFolder) {
		const parentFolder = inFolder ?? currentFolder.value;
		//@ts-ignore - Ignore TS error because it is not able to deduce the type associated to the card's category
		parentFolder.addFolder(folder);
	}

	function updateFolderMetadata(folder: CardFolder, newMetadata: CardFolderMetadata) {
		folder.metadata = newMetadata;
	}

	function deleteFolder(folder: CardFolder) {
		folder.parent?.deleteFolder(folder);
	}

	function moveFolder(folder: CardFolder, to: CardFolder) {
		folder.moveFolder(to);
	}

	function addCard(card: CardTypes, inFolder?: CardFolder) {
		const parentFolder = inFolder ?? currentFolder.value;
		if (parentFolder.metadata._category === card._category) {
			//@ts-ignore - Ignore TS error because it is not able to deduce the type associated to the card's category
			parentFolder.addFile(card);
		} else
			throw new FileError(
				FileErrorCodes.InvalidOperation,
				`Cannot add a card of category ${card._category} in a folder of category ${parentFolder.metadata._category}`
			);
	}

	function updateCard(card: CardTypes, inFolder?: CardFolder) {
		const parentFolder = inFolder ?? currentFolder.value;
		const list = parentFolder.files;
		const idx = list.findIndex((entry) => entry.id === card.id);
		if (idx !== -1) list[idx] = card;
	}

	function deleteCard(card: CardTypes, inFolder?: CardFolder) {
		const parentFolder = inFolder ?? currentFolder.value;
		const list = parentFolder.files;
		const index = list.findIndex((entry) => entry.id === card.id);
		if (index !== -1) {
			// Search in each array for eventual entries referencing the object we're about to delete
			for (const key in cards.value) {
				// TODO walk through deep file lists
				const files = getAllFiles(key as keyof typeof cards.value);
				files.forEach((entry: CardTypes) => {
					// If this entry's tags contain a reference to the object we're about to delete, remove it
					const referenceIndex = entry.tags.findIndex(
						(event: number) => event === card.id
					);
					if (referenceIndex != -1) entry.tags.splice(referenceIndex, 1);
				});
			}

			// Finally delete the payload object from state
			list.splice(index, 1);
		}
	}

	function moveCard(card: CardTypes, from: CardFolder, to: CardFolder) {
		deleteCard(card, from);
		addCard(card, to);
	}

	function updateWholeFileList<T extends CardCategory>(
		list: CardTypeBasedOnCategory<T>[],
		inFolder?: CardFolder
	) {
		(inFolder ?? currentFolder.value).files = list;
	}

	function updateWholeSubfolderList(list: CardFolder[], inFolder?: CardFolder) {
		(inFolder ?? currentFolder.value).subfolders = list;
	}

	function $reset() {
		cards.value = defaultCards();
	}

	function $hydrate(payload: SerializedState) {
		Object.keys(payload.cards).forEach((category) => {
			//@ts-ignore - Ignore TS error because it is not able to deduce the type associated to the current category
			const deserialized = CardFolder.deserialize(payload.cards[category]);
			// Create default folder if deserialization fails
			//@ts-ignore - Same reason
			cards.value[category] = deserialized
				? deserialized
				: createRootFolder(category as CardCategory);
		});
	}

	return {
		// State
		cards,
		currentCategory,
		currentFolderPath,
		currentFolder,
		serializableState,

		// State setter
		setCurrentFolder,

		// Getters
		getAllFiles,
		getAllFolders,
		getCategoryFolder,
		findFileInFolder,
		findFile,

		// Folder actions
		addFolder,
		updateFolderMetadata,
		deleteFolder,
		moveFolder,

		// Card actions
		addCard,
		updateCard,
		deleteCard,
		moveCard,

		updateWholeFileList,
		updateWholeSubfolderList,

		// Store management
		$reset,
		$hydrate,
	};
});
