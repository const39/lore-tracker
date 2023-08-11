import { LoreEntry } from "@/core/models";
import CardRepo from "./CardRepo";

export default class LoreEntryRepo<T extends LoreEntry> extends CardRepo<T> {
	use = LoreEntry;
}
