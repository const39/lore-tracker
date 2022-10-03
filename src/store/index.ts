import Vue from "vue";
import Vuex from "vuex";
import { LocalStorageKey, Season, CardsStore, CategoryFilter, Filter, State, CardCategory, CardTypes, ID, SaveFormat, Order, Folder, FileTreeNode, FileTypes } from "@/js/types";
import saves, { SaveVersion } from "@/js/saves";
import utilities from "@/js/utilities";

Vue.use(Vuex);


function defaultCards(): CardsStore {
	// Generate automatically the CardsStore using the CardCategory enum values as keys
	const cards = {} as CardsStore;
	for(const category of Object.values(CardCategory)) cards[category] = [];
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
		files: []
	}
}

function defaultNotepad() {
	const table = new Map<string, FileTreeNode>();
	table.set('/', defaultFileTreeNode());	// Set root node
	return table;
}

function defaultState(): State {
	return {
		_meta: {
			version: SaveVersion.Latest,
			lastUpdate: new Date().toISOString()
		},
		name: "Campaign",
		days: 0,
		season: Season.SPRING,
		cards: defaultCards(),
		notepad: defaultNotepad(),
		filter: defaultFilter(),
		order: Order.DEFAULT,
		quickNote: "",
	}
}

export default new Vuex.Store({
	state: defaultState(),
	getters: {
		isFilterActive: (state) => {
			const defFilter = defaultFilter();
			// Filter is active if at least one field of the filter is different from the default (blank) filter
			// ! HARDCODE 'tags' array comparison because it would need a deep equal comparison otherwise
			return state.filter.category !== defFilter.category || state.filter.text !== defFilter.text || state.filter.tags.length !== 0 
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
			function filterCards(cards:CardsStore, filter: Filter) {

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
								predicate = utilities.getAllText(entry).some(text => text.toLowerCase().includes(str));
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
			function sortCards(cards:CardsStore) {

				for (const field in cards) {
					cards[field as keyof typeof cards].sort((a: CardTypes, b: CardTypes) => {
						const textA = utilities.getText(a).toLowerCase();
						const textB = utilities.getText(b).toLowerCase();
						return textA.localeCompare(textB);
					});
				}
			}

			const cards = filterCards(state.cards, state.filter);
			if(state.order === Order.ALPHANUMERIC) sortCards(cards);
			return cards;
		},
		getByIdInCategory: (state) => (id: ID, category: CardCategory): CardTypes | undefined => {
			const idx = state.cards[category].findIndex((entry: CardTypes) => entry.id === id);
			return idx != -1 ? state.cards[category][idx] : undefined;
		},
		getById: (state, getters) => (id: ID): CardTypes | undefined => {
			for (const key in state.cards) {
				const ret = getters.getByIdInCategory(id, key);
				if(ret) return ret;
			}
			return undefined;
		},
		cardCount: (state) => {
			let count = 0;
			for (const key in state.cards) count += state.cards[key as keyof typeof state.cards].length
			return count;
		},
		getFolderContent: (state) => (path: string) => {
			return state.notepad.get(path);
		},
		toJSON: (state) => {
			// Split state data to exclude filter and order from JSON
			const { filter, order, ...toSave } = { ...state };
			// Update date
			toSave._meta.lastUpdate = new Date().toISOString();
			return JSON.stringify(toSave);
		},
	},
	mutations: {
		// ** Whole state mutations **
		resetState(state) {
			// We use Object.assign() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Objects
			Object.assign(state, defaultState());
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
		setState(state, payload: State | SaveFormat) {
			Object.assign(state, payload);
		},
		// ** Card mutations **
		addCard(state, payload: CardTypes) {
			state.cards[payload._category].unshift(payload as any);
		},
		updateCard(state, payload: CardTypes) {
			const list: CardTypes[] = state.cards[payload._category];
			const index = list.findIndex((entry) => entry.id === payload.id);
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Arrays
			if (index !== -1) Vue.set(list, index, payload);
		},
		deleteCard(state, payload: CardTypes) {
			const list: CardTypes[] = state.cards[payload._category];
			const index = list.findIndex((entry) => entry.id === payload.id);
			if (index !== -1) {
				// Search in each array for eventual entries referencing the object we're about to delete
				for (const key in state.cards) {
					state.cards[key as keyof typeof state.cards].forEach((entry: CardTypes) => {
						// If this entry's tags contain a reference to the object we're about to delete, remove it
						const referenceIndex = entry.tags.findIndex((event: number) => event === payload.id);
						if (referenceIndex != -1) entry.tags.splice(referenceIndex, 1);
					});
				}

				// Finally delete the payload object from state
				list.splice(index, 1);
			}
		},
		updateWholeList(state, payload: {category: CardCategory, list: CardTypes[]}) {
			Vue.set(state.cards, payload.category, payload.list);
		},
		// ** Other data mutations **
		setName(state, payload: string) {
			if (payload) state.name = payload.trim();
		},
		setDaysCount(state, payload: number) {
			if (Number.isSafeInteger(payload) && payload > -1) state.days = payload;
		},
		setSeason(state, payload: Season) {
			if(payload) state.season = payload;
		},
		// ** Quick Note mutations **
		setQuickNote(state, payload: string) {
			state.quickNote = payload.trim() ?? "";
		},
		// ** Notepad mutations **
		addFolder(state, payload: {pathToParent: string, folder: Folder}) {
			const sanitizedPathToParent = utilities.sanitizePath(payload.pathToParent);

			// Add the payload folder to its parent's children list
			const parent = state.notepad.get(sanitizedPathToParent);
			if(parent) parent.folders.push(payload.folder)
			else {
				const node = defaultFileTreeNode();
				node.folders.push(payload.folder);
				state.notepad.set(sanitizedPathToParent, node)
			}

			// Create new entry in table for the newly created folder
			const path = utilities.joinPaths(sanitizedPathToParent, payload.folder.name);
			state.notepad.set(path, defaultFileTreeNode());
		},	
		updateFolder(state, payload: {pathToParent: string, folder: Folder}) {
			// TODO
		},	
		deleteFolder(state, payload: {pathToParent: string, folder: Folder}) {
			const sanitizedPathToParent = utilities.sanitizePath(payload.pathToParent);

			// Remove the payload folder from its parent's children list
			const parent = state.notepad.get(sanitizedPathToParent);
			if(parent) {
				const idx = parent.folders.findIndex(elem => elem.name === payload.folder.name)
				if(idx != -1) parent.folders.splice(idx);
			}

			// Remove the deleted folder table entry
			const path = utilities.joinPaths(sanitizedPathToParent, payload.folder.name);
			state.notepad.delete(path);
		},	
		addFile(state, payload: {pathToParent: string, file: FileTypes}) {
			const sanitizedPathToParent = utilities.sanitizePath(payload.pathToParent);

			const parent = state.notepad.get(sanitizedPathToParent);
			if(parent) parent.files.push(payload.file)
			else {
				const node = defaultFileTreeNode();
				node.files.push(payload.file);
				state.notepad.set(sanitizedPathToParent, node)
			}
		},	
		updateFile(state, payload: {pathToParent: string, file: FileTypes}) {
			// TODO
		},	
		deleteFile(state, payload: {pathToParent: string, file: FileTypes}) {
			const sanitizedPathToParent = utilities.sanitizePath(payload.pathToParent);

			const parent = state.notepad.get(sanitizedPathToParent);
			if(parent) {
				const idx = parent.files.findIndex(elem => elem.id === payload.file.id)
				if(idx != -1) parent.files.splice(idx);
			}
		},	

		// ** Filter mutations **
		updateFilter(state, payload: Filter) {
			// ! Only check for undefined/null using '??' instead of '||' to allow setting empty strings or booleans  
			state.filter.category = payload.category ?? state.filter.category;
			state.filter.text = (payload.text ?? state.filter.text).toLowerCase();
			state.filter.tags = payload.tags ?? state.filter.tags;
		},
		resetFilter(state) {
			// We use Vue.set() to replace the object at index with our new object while allowing Vue to still track changes to that object
			// @see https://v2.vuejs.org/v2/guide/reactivity.html#For-Arrays
			Vue.set(state, "filter", {});
		},
		setOrder(state, payload: Order) {
			if(Object.values(Order).includes(payload)) state.order = payload;
			else state.order = Order.DEFAULT;
		}
	},
	actions: {
		commitAndSave({commit, dispatch}, obj: { commit: string, payload: object }) {
			commit(obj.commit, obj.payload);
			dispatch('save');
		},
		// ** Save actions
		loadData({commit}, payload?: string) {
			// Get persisted raw data (from payload or from LocalStorage if no payload)
			const rawData = payload || localStorage.getItem(LocalStorageKey.DATA_KEY);

			// Perform parsing, validation and conversion if there is data
			// If there is no data to be used, leave the default state as is
			if(rawData) {
				// * Validate (and convert if necessary) save format
				// The conversion method will throw an error if the save cannot be used. If an error is thrown:
				//  - It is not caught to propagate it to UI
				//  - Current state is not lost because it has not been cleared
				const parsedData = saves.convertToLatest(JSON.parse(rawData));
				commit('setState', parsedData);
			}
		},
		save({getters}) {
			localStorage.setItem(LocalStorageKey.DATA_KEY, getters.toJSON);
		},
		deleteSave() {
			localStorage.removeItem(LocalStorageKey.DATA_KEY);
		},
	},
	modules: {},
});
