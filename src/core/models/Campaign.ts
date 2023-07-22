import { Model } from "pinia-orm";
import { Num, Str, Uid } from "pinia-orm/dist/decorators";
import { UUID } from "../utils/types";

export enum Season {
	SPRING = "spring",
	SUMMER = "summer",
	AUTUMN = "autumn",
	WINTER = "winter",
}

interface ICampaign {
	name: string;
	days: number;
	season: Season;
	quickNote: string;
}

type MinimalCampaign = Partial<ICampaign>;

export const campaignEntityName = "campaigns";

export class Campaign extends Model implements ICampaign {
	static entity = campaignEntityName;

	@Uid() declare id: UUID;
	@Str("Campaign") declare name: string;
	@Num(1) declare days: number;
	@Str(Season.SPRING) declare season: Season;
	@Str("") declare quickNote: string;

	constructor(data?: MinimalCampaign, ...args: any[]) {
		super(data, ...args);
	}

	static revive(data: MinimalCampaign) {
		return new Campaign(data);
	}
}
