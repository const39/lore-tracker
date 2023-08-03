import { RouteLocationRaw } from "vue-router";
import { Folder, LoreEntry } from "@/core/models";

/**
 * Get the vue-router route params and hash to navigate to the specified card.
 * @param card the card to navigate to
 * @returns the card's vue-router route params, or undefined if the card cannot be navigated to
 */
export function useCardLink(card: Folder | LoreEntry): RouteLocationRaw | undefined {
	// Get the ID of the folder hosting the item referenced by the tag
	const targetFolderId = card?.folderId || card?.parentId;
	if (targetFolderId) {
		// Navigate to the card's folder, passing along the card ID in the URL's hash
		return {
			params: {
				category: card.category,
				folderId: targetFolderId,
			},
			hash: `#${card.id}-card`,
		};
	}
	return undefined;
}
