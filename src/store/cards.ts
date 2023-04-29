import {
	CardCategory,
	CardTypes,
	CardsStore,
	CategoryFilter,
	Filter,
	ID,
	SerializedState,
} from "@/js/types";
import utilities from "@/js/utilities";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useFilterStore } from "./filter";
import { usePreferencesStore } from "./preferences";

function defaultCards(): CardsStore {
	// Generate automatically the CardsStore using the CardCategory enum values as keys
	const cards = {} as CardsStore;
	for (const category of Object.values(CardCategory)) cards[category] = [];
	return cards;
}

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

export const useCardsStore = defineStore("cards", () => {
	const cards = ref(defaultCards());

	const prefStore = usePreferencesStore();
	const filter = useFilterStore();

	const serializableState = computed(() => ({ cards }));

	const filteredCards = computed(() => {
		const filtered = filterCards(cards.value, filter);
		if (prefStore.cardsOrder === "alphanumeric") sortCards(filtered);
		return filtered;
	});

	const cardCount = computed(() => {
		let count = 0;
		for (const key in cards.value) count += cards.value[key as keyof typeof cards.value].length;
		return count;
	});

	function getByIdInCategory(id: ID, category: CardCategory): CardTypes | undefined {
		const idx = cards.value[category].findIndex((entry: CardTypes) => entry.id === id);
		return idx != -1 ? cards.value[category][idx] : undefined;
	}

	function getById(id: ID): CardTypes | undefined {
		for (const key in cards.value) {
			const ret = getByIdInCategory(id, key as CardCategory);
			if (ret) return ret;
		}
		return undefined;
	}

	function addCard(card: CardTypes) {
		cards.value[card._category].unshift(card as any);
	}

	function updateCard(card: CardTypes) {
		const list: CardTypes[] = cards.value[card._category];
		const index = list.findIndex((entry) => entry.id === card.id);
		if (index !== -1) list[index] = card;
	}

	function deleteCard(card: CardTypes) {
		const list: CardTypes[] = cards.value[card._category];
		const index = list.findIndex((entry) => entry.id === card.id);
		if (index !== -1) {
			// Search in each array for eventual entries referencing the object we're about to delete
			for (const key in cards.value) {
				cards.value[key as keyof typeof cards.value].forEach((entry: CardTypes) => {
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

	function updateWholeList(payload: { category: CardCategory; list: CardTypes[] }) {
		cards.value[payload.category] = payload.list as any; // HACK: workaround typing for now
	}

	function $reset() {
		cards.value = defaultCards();
		filter.$reset();
	}

	function $hydrate(payload: SerializedState) {
		cards.value = payload.cards;
	}

	return {
		cards,
		filter,
		serializableState,

		filteredCards,
		cardCount,

		getByIdInCategory,
		getById,
		addCard,
		updateCard,
		deleteCard,
		updateWholeList,
		$reset,
		$hydrate,
	};
});
