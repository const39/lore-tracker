import { HasMany, Num, Str, Uid } from "pinia-orm/dist/decorators";
import { IndexedDBAdapter, database } from "../persistence";
import { UUID } from "../utils/types";
import { Folder } from "./Folder";
import { LoreEntry } from "./LoreEntry";
import { PersistentModel } from "./PersistentModel";
import { Indexable, StoreName, WithMeta } from "./types";

export enum Season {
	SPRING = "spring",
	SUMMER = "summer",
	AUTUMN = "autumn",
	WINTER = "winter",
}

export interface ICampaign extends Indexable, WithMeta {
	name: string;
	days: number;
	season: Season;
	quickNote: string;
}

type MinimalCampaign = Partial<ICampaign>;

export class Campaign extends PersistentModel implements ICampaign {
	static entity = StoreName.Campaign;
	static persistenceBackend = new IndexedDBAdapter<Campaign>(database, StoreName.Campaign);

	@Uid() declare id: UUID;
	@Str("") declare name: string;
	@Num(1) declare days: number;
	@Str(Season.SPRING) declare season: Season;
	@Str("") declare quickNote: string;

	@HasMany(() => LoreEntry, "campaignId") declare loreEntries: LoreEntry[];
	@HasMany(() => Folder, "campaignId") declare folders: Folder[];

	constructor(data?: MinimalCampaign, ...args: any[]) {
		super(data, ...args);
	}

	/**
	 * Revive a campaign record to an actual Campaign instance.
	 */
	static revive(data: Record<string, any>) {
		return new Campaign(data);
	}
}
