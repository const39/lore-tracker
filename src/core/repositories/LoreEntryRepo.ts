import { LoreEntry } from "@/core/models";
import BaseRepo from "./BaseRepo";

export default class LoreEntryRepo<T extends LoreEntry> extends BaseRepo<T> {
	use = LoreEntry;
}
