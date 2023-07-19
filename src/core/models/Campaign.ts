import { Model } from "pinia-orm";
import { Num, Str, Uid } from "pinia-orm/dist/decorators";
import { UUID } from "../utils/types";

export enum Season {
	SPRING = "spring",
	SUMMER = "summer",
	AUTUMN = "autumn",
	WINTER = "winter",
}

export interface ICampaign {
	name: string;
	days: number;
	season: Season;
	quickNote: string;
}

export const campaignEntityName = "campaigns";

export class Campaign extends Model implements ICampaign {
	static entity = campaignEntityName;

	@Uid() declare id: UUID;
	@Str("Campaign") declare name: string;
	@Num(1) declare days: number;
	@Str(Season.SPRING) declare season: Season;
	@Str("") declare quickNote: string;

	constructor(data?: ICampaign, ...args: any[]) {
		super(data, ...args);
	}

	static revive(data: ICampaign) {
		return new Campaign(data);
	}
}
