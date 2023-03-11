import {
	LocalStorageKey,
	Season,
	CardsStore,
	CategoryFilter,
	Filter,
	State,
	CardCategory,
	CardTypes,
	ID,
	SaveFormat,
	Order,
	Folder,
	FileTreeNode,
	FileTypes,
	FileTree,
} from "@/js/types";
import saves, { SaveVersion } from "@/js/saves";
import utilities from "@/js/utilities";
import { defineStore } from "pinia";

function defaultCards(): CardsStore {
	// Generate automatically the CardsStore using the CardCategory enum values as keys
	const cards = {} as CardsStore;
	for (const category of Object.values(CardCategory)) cards[category] = [];
	return cards;
}

function defaultFilter(): Filter {
	return {
		category: CategoryFilter.ALL,
		text: "",
		tags: [],
	};
}

function defaultFileTreeNode(): FileTreeNode {
	return {
		folders: [],
		files: [],
	};
}

function defaultState(): State {
	return {
		_meta: {
			version: SaveVersion.Latest,
			lastUpdate: new Date().toISOString(),
		},
		name: "Campaign",
		days: 0,
		season: Season.SPRING,
		cards: defaultCards(),
		notepad: new FileTree(),
		filter: defaultFilter(),
		order: Order.DEFAULT,
		quickNote: "",
	};
}

export const useStore = defineStore("store", {
	state: () => defaultState(),
	getters: {
		isFilterActive: (state) => {
			const defFilter = defaultFilter();
			// Filter is active if at least one field of the filter is different from the default (blank) filter
			// ! HARDCODE 'tags' array comparison because it would need a deep equal comparison otherwise
			return (
				state.filter.category !== defFilter.category ||
				state.filter.text !== defFilter.text ||
				state.filter.tags.length !== 0
			);
		},
		isDefaultOrder: (state) => {
			return state.order === Order.DEFAULT;
		},
		getCards: (state) => {
			/**
			 * Filter the specified cards using the given filter.
			 * @param cards cards from the current state
			 * @param filter filter from the current state
			 * @returns a new CardsStore object containing the cards, filtered according to the given filter
			 */
			function filterCards(cards: CardsStore, filter: Filter) {
				// Create another empty cards object to avoid modifying the state containing all cards
				const filteredCards = defaultCards();

				// Browse each array of cards
				for (const field in cards) {
					const key = field as keyof typeof cards;

					// The filter is applied to each relevant key (can be ALL)
					if (filter.category === CategoryFilter.ALL || filter.category === key) {
						// Filter out corresponding cards from the initial cards object

						(filteredCards[key] as CardTypes[]) = (cards[key] as CardTypes[]).filter((entry) => {
							/* The predicate conditions are exclusive :
							 * (1) if the first one is not fulfilled, the second one is not evaluated;
							 * (2) if any condition is evaluated to false, the predicate is considered not fulfilled
							 * In either case, the predicate returns false
							 * In other words, the only way for the predicate to return true is that each specified condition is evaluated to true
							 */
							let predicate = true;

							// If specified, search for corresponding text in text fields of the current entry
							if (filter.text) {
								const str = filter.text;
								predicate = utilities
									.getAllText(entry)
									.some((text) => text.toLowerCase().includes(str));
							}

							// If the previous condition has been fulfilled (if specified) and a tag condition is present (see (1)),
							// search for the corresponding tags in the current entry tag list
							if (predicate && filter?.tags?.length > 0) {
								for (const tag of filter.tags) {
									predicate &&= entry.tags.includes(tag);
									// If the condition is false, stop searching and return (see (2))
									if (!predicate) break;
								}
							}

							return predicate;
						});
					}
				}
				return filteredCards;
			}

			/**
			 * Sort (in-place) the specified cards in the alphanumeric order
			 * @param cards the cards to sort
			 */
			function sortCards(cards: CardsStore) {
				for (const field in cards) {
					cards[field as keyof typeof cards].sort((a: CardTypes, b: CardTypes) => {
						const textA = utilities.getText(a).toLowerCase();
						const textB = utilities.getText(b).toLowerCase();
						return textA.localeCompare(textB);
					});
				}
			}

			const cards = filterCards(state.cards, state.filter);
			if (state.order === Order.ALPHANUMERIC) sortCards(cards);
			return cards;
		},
		getByIdInCategory(state) {
			return (id: ID, category: CardCategory): CardTypes | undefined => {
				const idx = state.cards[category].findIndex((entry: CardTypes) => entry.id === id);
				return idx != -1 ? state.cards[category][idx] : undefined;
			};
		},
		getById(state) {
			return (id: ID): CardTypes | undefined => {
				for (const key in state.cards) {
					const ret = this.getByIdInCategory(id, key as CardCategory);
					if (ret) return ret;
				}
				return undefined;
			};
		},
		cardCount: (state) => {
			let count = 0;
			for (const key in state.cards) count += state.cards[key as keyof typeof state.cards].length;
			return count;
		},
		doesFolderExist: (state) => (path: string) => {
			return state.notepad.has(utilities.sanitizePath(true, path));
		},
		getFolderContent: (state) => (path: string) => {
			return state.notepad.get(utilities.sanitizePath(true, path));
		},
		toJSON: (state) => {
			const serialized = saves.serialize(state);
			return JSON.stringify(serialized);
		},
	},
	actions: {
		// ! OLD MUTATIONS
		// ** Whole state mutations **
		resetState() {
			this.$reset();
		},
		/**
		 * Assign or add new values to the current state properties.
		 * The current state and the specified payload are merged:
		 * 	- Payload new properties are added to the state;
		 * 	- Colliding properties are overwritten with payload values;
		 * 	- Pre-existing state properties not set in payload are left unchanged.
		 * @param state
		 * @param payload Payload to merge with current state. Can be either a State or SaveFormat object.
		 */
		setState(payload: State | SaveFormat) {
			this.$patch(payload);
		},
		// ** Card mutations **
		addCard(payload: CardTypes) {
			this.cards[payload._category].unshift(payload as any);
		},
		updateCard(payload: CardTypes) {
			const list: CardTypes[] = this.cards[payload._category];
			const index = list.findIndex((entry) => entry.id === payload.id);
			if (index !== -1) list[index] = payload;
		},
		deleteCard(payload: CardTypes) {
			const list: CardTypes[] = this.cards[payload._category];
			const index = list.findIndex((entry) => entry.id === payload.id);
			if (index !== -1) {
				// Search in each array for eventual entries referencing the object we're about to delete
				for (const key in this.cards) {
					this.cards[key as keyof typeof this.cards].forEach((entry: CardTypes) => {
						// If this entry's tags contain a reference to the object we're about to delete, remove it
						const referenceIndex = entry.tags.findIndex((event: number) => event === payload.id);
						if (referenceIndex != -1) entry.tags.splice(referenceIndex, 1);
					});
				}

				// Finally delete the payload object from state
				list.splice(index, 1);
			}
		},
		updateWholeList(payload: { category: CardCategory; list: CardTypes[] }) {
			this.cards[payload.category] = payload.list as any; // HACK: workaround typing for now
		},
		// ** Other data mutations **
		setName(payload: string) {
			if (payload) this.name = payload.trim();
		},
		setDaysCount(payload: number) {
			if (Number.isSafeInteger(payload) && payload > -1) this.days = payload;
		},
		setSeason(payload: Season) {
			if (payload) this.season = payload;
		},
		// ** Quick Note mutations **
		setQuickNote(payload: string) {
			this.quickNote = payload.trim() ?? "";
		},
		// ** Notepad mutations **
		addFolder(payload: { pathToParent: string; folder: Folder }) {
			const sanitizedPathToParent = utilities.sanitizePath(true, payload.pathToParent);

			// Add the payload folder to its parent's children list
			const parent = this.notepad.get(sanitizedPathToParent);
			if (parent) parent.folders.push(payload.folder);
			else {
				const node = defaultFileTreeNode();
				node.folders.push(payload.folder);
				this.notepad.set(sanitizedPathToParent, node);
			}

			// Create new entry in table for the newly created folder
			const path = utilities.joinPaths(true, sanitizedPathToParent, payload.folder.name);
			this.notepad.set(path, defaultFileTreeNode());
		},
		updateFolder(payload: { pathToParent: string; folder: Folder }) {
			// TODO
		},
		deleteFolder(payload: { pathToParent: string; folder: Folder }) {
			const sanitizedPathToParent = utilities.sanitizePath(true, payload.pathToParent);

			// Remove the payload folder from its parent's children list
			const parent = this.notepad.get(sanitizedPathToParent);
			if (parent) {
				const idx = parent.folders.findIndex((elem) => elem.name === payload.folder.name);
				if (idx != -1) parent.folders.splice(idx);
			}

			// Remove the deleted folder table entry
			const path = utilities.joinPaths(true, sanitizedPathToParent, payload.folder.name);
			this.notepad.delete(path);
		},
		addFile(payload: { pathToParent: string; file: FileTypes }) {
			const sanitizedPathToParent = utilities.sanitizePath(true, payload.pathToParent);

			const parent = this.notepad.get(sanitizedPathToParent);
			if (parent) parent.files.push(payload.file);
			else {
				const node = defaultFileTreeNode();
				node.files.push(payload.file);
				this.notepad.set(sanitizedPathToParent, node);
			}
		},
		updateFile(payload: { pathToParent: string; file: FileTypes }) {
			// TODO
		},
		deleteFile(payload: { pathToParent: string; file: FileTypes }) {
			const sanitizedPathToParent = utilities.sanitizePath(true, payload.pathToParent);

			const parent = this.notepad.get(sanitizedPathToParent);
			if (parent) {
				const idx = parent.files.findIndex((elem) => elem.id === payload.file.id);
				if (idx != -1) parent.files.splice(idx);
			}
		},

		// ** Filter mutations **
		updateFilter(payload: Filter) {
			// ! Only check for undefined/null using '??' instead of '||' to allow setting empty strings or booleans
			this.filter.category = payload.category ?? this.filter.category;
			this.filter.text = (payload.text ?? this.filter.text).toLowerCase();
			this.filter.tags = payload.tags ?? this.filter.tags;
		},
		resetFilter() {
			this.filter = defaultFilter();
		},
		setOrder(payload: Order) {
			if (Object.values(Order).includes(payload)) this.order = payload;
			else this.order = Order.DEFAULT;
		},
		// ! OLD ACTIONS
		commitAndSave(obj: { commit: string; payload: any }) {
			this[obj.commit](obj.payload); // FIXME
			this.save();
		},
		// ** Save actions
		loadData(payload?: string) {
			// Get persisted raw data (from payload or from LocalStorage if no payload)
			const rawData = payload || localStorage.getItem(LocalStorageKey.DATA_KEY);

			// Perform parsing, validation and conversion if there is data
			// If there is no data to be used, leave the default state as is
			if (rawData) {
				// * Validate (and convert if necessary) save format
				// The conversion method will throw an error if the save cannot be used. If an error is thrown:
				//  - It is not caught to propagate it to UI
				//  - Current state is not lost because it has not been cleared
				const validData = saves.ensureLatestVersion(JSON.parse(rawData));
				const deserialized = saves.deserialize(validData);
				this.setState(deserialized);
			}
		},
		save() {
			localStorage.setItem(LocalStorageKey.DATA_KEY, this.toJSON);
		},
		deleteSave() {
			localStorage.removeItem(LocalStorageKey.DATA_KEY);
		},
	},
});
