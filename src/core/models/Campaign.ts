import { Model } from "pinia-orm";
import { Num, Str, Uid } from "pinia-orm/dist/decorators";
import { ID } from "../model/cards";

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

	@Uid() declare id: ID;
	@Str("") declare name: string;
	@Num(1) declare days: number;
	@Str("") declare season: Season;
	@Str("") declare quickNote: string;

	constructor(data?: ICampaign) {
		super(data);
	}
}
