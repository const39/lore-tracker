import { Campaign } from "../models";
import BaseRepo from "./BaseRepo";

export default class CampaignRepo extends BaseRepo<Campaign> {
	use = Campaign;

	// The app only supports one campaign for now.
	getCurrentCampaign(): Campaign {
		return this.all()[0];
	}
}
