import { Campaign, Category, Folder } from "../models";
import { UUID } from "../utils/types";
import BaseRepo, { QueryOptions } from "./BaseRepo";
import FolderRepo from "./FolderRepo";

export default class CampaignRepo extends BaseRepo<Campaign> {
	use = Campaign;

	using(campaign: Campaign, options?: QueryOptions) {
		return this.repo(FolderRepo).createQuery(options).where("campaignId", campaign.id);
	}

	getCampaign(id: UUID) {
		return this.find(id);
	}

	getFolder(campaign: Campaign, folderId: UUID, category?: Category, options?: QueryOptions) {
		const query = this.using(campaign, options);
		if (category) {
			return query.whereId(folderId).where("category", category).first();
		} else {
			return query.find(folderId);
		}
	}

	getRootFolder(campaign: Campaign, category: Category, options?: QueryOptions) {
		// Type assertion is there because root folders SHOULD have been created on app startup (see LoreBook.vue)
		return this.using(campaign, options).where("name", `${category}-root`).first()!;
	}

	getRootFolders(campaign: Campaign, options?: QueryOptions) {
		return Object.values(Category).map((category) =>
			this.getRootFolder(campaign, category, options)
		);
	}

	createRootFolder(campaign: Campaign, category: Category) {
		return this.repo(FolderRepo).add(Folder.createRootFolder(campaign, category));
	}
}
