/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from "ajv";
import { SaveFormat } from "@/core/save/save-manager";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utils/functions";
import schemaLegacy from "@/schemas/save_format_legacy.json";
import schemaV1 from "@/schemas/save_format_v1.json";
import schemaV2 from "@/schemas/save_format_v2.json";
import schemaV3 from "@/schemas/save_format_v3.json";
import { LocalisableError } from "../error";
import { Category } from "../models";
import { UUID } from "../utils/types";

export class SaveFormatError extends LocalisableError {
	override toLocaleString(): string {
		return $t("messages.errors.corruptedSave");
	}
}

export enum SaveVersion {
	Legacy = "save-legacy",
	v1 = "save-v1",
	v2 = "save-v2",
	v3 = "save-v3",
	Latest = "save-v3",
}

/**
 * Extract the version number from a SaveVersion string.
 * @param saveVersion the save version
 * @returns the version number of the SaveVersion string. Returns 0 for {@link SaveVersion.Legacy}.
 */
export function getSaveVersionNumber(saveVersion: SaveVersion): number {
	const matches = saveVersion.match(/.+v(?<num>(\d+))/);
	return Number(matches?.groups?.num ?? 0);
}

const validator = new Ajv()
	.addSchema(schemaLegacy, SaveVersion.Legacy)
	.addSchema(schemaV1, SaveVersion.v1)
	.addSchema(schemaV2, SaveVersion.v2)
	.addSchema(schemaV3, SaveVersion.v3);

/**
 * Validate data from a save file against a JSON schema corresponding to the specified save format.
 * @param save the save data to validate
 * @param format the save format descriptor. Describes the schema against which data will be validated. Will throw an error if format does not describe a registered schema.
 * @returns a boolean indicating if the data validates against the specified save format.
 */
export function validateSave(save: SaveFormat | object, format: SaveVersion) {
	const isValid = validator.validate(format, save);
	if (!isValid && process.env.NODE_ENV !== "production")
		console.error("Validation errors:", validator.errors);
	return isValid;
}

abstract class SaveConverter {
	inputSaveVersion: SaveVersion;
	targetSaveVersion: SaveVersion;

	constructor(inputSaveVersion: SaveVersion, targetSaveVersion: SaveVersion) {
		this.inputSaveVersion = inputSaveVersion;
		this.targetSaveVersion = targetSaveVersion;
	}

	abstract convert(save: any): any;
}

class V1SaveConverter extends SaveConverter {
	constructor() {
		super(SaveVersion.Legacy, SaveVersion.v1);
	}

	/**
	 * Convert legacy-format data to v1-format.
	 * Changes between legacy and v1 formats are:
	 * - New field: '_category' in each card
	 * - New field: '_meta' on root object
	 * - New field: 'quickNote' on root object
	 * - Changes to Objectives
	 * - New Faction category
	 * - Remove plural on card category array fields
	 *
	 *
	 * @param save data to convert to v1 format
	 * @returns input data converted to v1 format
	 */
	override convert(save: any): any {
		// Convert root object:
		// - Add '_meta' property
		// - Add 'quickNote' property
		// - Keep previous fields
		const converted = {
			_meta: {
				version: SaveVersion.v1,
				lastUpdate: new Date().toISOString(),
			},
			name: save.name,
			days: save.days,
			season: save.season,
			cards: {} as any,
			quickNote: "",
		};

		// Convert cards:
		// - Transform Objectives to Quests
		// - Use category constant as field name (i.e. remove plural on card fields)
		// - Add corresponding '_category' field on each card
		// - Add new Faction category
		converted.cards.quest = save.cards.objectives.map((entry: any) => {
			return {
				_category: "quest",
				id: entry.id,
				tags: entry.tags,
				title: entry.desc,
				tasks: [],
			};
		});

		converted.cards.event = save.cards.events.map((entry: any) => ({
			_category: "event",
			...entry,
		}));
		converted.cards.location = save.cards.locations.map((entry: any) => ({
			_category: "location",
			...entry,
		}));
		converted.cards.character = save.cards.characters.map((entry: any) => ({
			_category: "character",
			...entry,
		}));
		converted.cards.note = save.cards.notes.map((entry: any) => ({
			_category: "note",
			...entry,
		}));
		converted.cards.faction = [];

		return converted;
	}
}

class V2SaveConverter extends SaveConverter {
	constructor() {
		super(SaveVersion.v1, SaveVersion.v2);
	}

	/**
	 * Convert v1-format data to v2-format.
	 * Changes between v1 and v2 formats are:
	 * - Convert each card list to a file tree
	 *
	 * @param save data to convert to v2 format
	 * @returns input data converted to v2 format
	 */
	override convert(save: any): any {
		const converted = utilities.deepCopy(save);

		// For each category, create a root folder and set all existing cards as its files
		Object.keys(converted.cards).forEach((category) => {
			converted.cards[category] = this.createRootFolder(
				category as Category,
				converted.cards[category]
			);
		});

		// Update save version
		converted._meta.version = SaveVersion.v2;

		return converted;
	}

	/**
	 * Create a serialized root folder used by the V2 save format.
	 * @param category the category of the folder to create
	 */
	protected createRootFolder<T extends Category>(category: T, files?: any[]) {
		const dummyHash = `dummy-hash-${category}-${Date.now()}`;
		const metadata = {
			id: Date.now() + Math.random() * 50,
			_category: category,
			color: "#ffffff",
			name: `${category}-root`,
		};
		return {
			[dummyHash]: {
				metadata,
				files,
				subfolders: [],
			},
		};
	}
}

class V3SaveConverter extends SaveConverter {
	private idConversionMapping = new Map<number, UUID>();

	constructor() {
		super(SaveVersion.v2, SaveVersion.v3);
	}

	/**
	 * Convert v2-format data to v3-format.
	 * Changes between v2 and v3 formats are:
	 * - Add a 'tags' list to the folders' metadata
	 * - Add a 'position' field to all files and folders
	 * - Add a 'desc' field to quests
	 * - Rename field '_category' to 'category' on every folder and file
	 * - Convert all numeric IDs to string UUIDs
	 * - Add the foreign key fields to LoreEntry and Folder items
	 *
	 * @param save data to convert to v3 format
	 * @returns input data converted to v3 format
	 */
	override convert(save: any): SaveFormat {
		const converted = this.convertToORMFormat(this.convertFieldsAndIDs(save));

		// Update save version
		converted._meta.version = SaveVersion.v3;

		return converted as SaveFormat;
	}

	private convertID(oldId: number) {
		// If the ID has already been converted, return its new value
		const alreadyConverted = this.idConversionMapping.get(oldId);
		if (alreadyConverted) return alreadyConverted;

		// Otherwise, convert it and store it in the map for future retrieval
		const newId = utilities.uuid();
		this.idConversionMapping.set(oldId, newId);
		return newId;
	}

	private getPosition(idx: number, total: number) {
		// - Previously to save-v3, position was implicitly saved as the item's index in its array: index = 0 was the highest position.
		// - From save-v3 and onward, position is explicity saved in a field, sorted in desc order.
		// As such, the logic is inverted: the higher the position, the higher the item is. Position = 0 means the farthest position.
		// - Because the new format is inverted, we can get the new position like this:
		return total - idx;
	}

	private convertFieldsAndIDs(save: any) {
		const copy = utilities.deepCopy(save);

		// [1] Add a new 'tags' array in every folder's metadata
		// [2] Add a new 'position' field on every folder and file
		// [3] Rename field '_category' to 'category' on every folder and file
		// [4] Convert folder's metadata ID
		// [5] Convert every file's ID and tags
		// [6] Add a new 'desc' field on every quest
		Object.keys(copy.cards).forEach((category) => {
			const rootFolder = copy.cards[category];
			Object.keys(rootFolder).forEach((folderHash, idx, arr) => {
				const folder = rootFolder[folderHash];
				folder.metadata.tags = []; // [1]
				folder.metadata.position = this.getPosition(idx, arr.length); // [2]
				folder.metadata.category = folder.metadata._category; // [3]
				delete folder.metadata._category; // [3]
				folder.metadata.id = this.convertID(folder.metadata.id); // [4]

				folder.files.forEach((file: any, i: number, a: any[]) => {
					file.id = this.convertID(file.id); // [4]
					file.category = file._category; // [3]
					delete file._category; // [3]
					file.position = this.getPosition(i, a.length); // [2]
					if (category === "quest") file.desc = ""; // [6]
				});
			});
		});

		// Once all card IDs have been converted, do a second pass to update the tags with the new IDs [4]
		Object.keys(copy.cards).forEach((category) => {
			const rootFolder = copy.cards[category];
			Object.keys(rootFolder).forEach((folderHash) => {
				const folder = rootFolder[folderHash];
				folder.files.forEach((file: any) => {
					file.tags = file.tags.map((oldId: number) => this.convertID(oldId)); // [4]
				});
			});
		});

		return copy;
	}

	private convertToORMFormat(save: any) {
		// Create the campaign object
		const campaign = {
			id: utilities.uuid(),
			name: save.name,
			days: save.days,
			season: save.season,
			quickNote: save.quickNote,
		};

		// Group all cards in the same object
		const loreEntries: Record<string, any> = {};
		Object.keys(save.cards).forEach((category) => {
			const rootFolder = save.cards[category];
			Object.keys(rootFolder).forEach((folderHash) => {
				// Add the 'folderId' foreign key to every file of this folder
				// and add the card with the others
				const folderId = rootFolder[folderHash].metadata.id;
				rootFolder[folderHash].files.forEach((file: any) => {
					loreEntries[file.id] = { ...file, folderId, campaignId: campaign.id };
				});
			});
		});

		// Group all folders
		const folders: Record<string, any> = {};
		Object.keys(save.cards).forEach((category) => {
			const rootFolder = save.cards[category];
			Object.keys(rootFolder).forEach((folderHash) => {
				const metadata = rootFolder[folderHash].metadata;
				const folderId = metadata.id;
				// Add the 'parentId' foreign key to the folder
				const parentHash = rootFolder[folderHash].parent;
				const parentId = parentHash ? rootFolder[parentHash].metadata.id : undefined;
				// Merge metadata with the other fields
				folders[folderId] = {
					id: folderId,
					category: metadata.category,
					name: metadata.name,
					position: metadata.position,
					color: metadata.color,
					tags: metadata.tags,
					parentId,
					campaignId: campaign.id,
				};
			});
		});

		const converted = {
			_meta: save._meta,
			campaigns: {
				[campaign.id]: campaign,
			},
			loreEntries: loreEntries,
			folders: folders,
		};

		return converted;
	}
}

function getProcessorFromInputVersion(inputSaveVersion: SaveVersion): SaveConverter | undefined {
	switch (inputSaveVersion) {
		case SaveVersion.Legacy:
			return new V1SaveConverter();
		case SaveVersion.v1:
			return new V2SaveConverter();
		case SaveVersion.v2:
			return new V3SaveConverter();
		case SaveVersion.v3:
		case SaveVersion.Latest:
			return undefined;
	}
}

function buildConversionPipeline(inputSaveVersion: SaveVersion) {
	const toPipe = [];
	let nextInput = inputSaveVersion;
	while (nextInput !== SaveVersion.Latest) {
		const proc = getProcessorFromInputVersion(nextInput);
		if (proc) {
			nextInput = proc.targetSaveVersion;
			toPipe.push((arg: any) => proc.convert(arg));
		} else break;
	}

	return utilities.pipe(...toPipe);
}

/**
 * Convert save data to the latest format. If the save is already at the latest version, it is returned as is.
 * This method throws an error if the format of the specified save cannot be identified and as such cannot be converted.
 *
 * @param save the save data to convert
 * @returns the save data, converted if necessary to the latest save format.
 *
 * @throws {SaveFormatError} if the save cannot be used or converted due to an invalid format
 */
export function convertToLatestVersion(save: any): SaveFormat {
	const inputSaveVersion = (save?._meta?.version as SaveVersion) ?? SaveVersion.Legacy;

	// Fail if save version is unknown
	if (!Object.values(SaveVersion).includes(inputSaveVersion))
		throw new SaveFormatError("Save format could not be identified: save data is unusable.");

	// Fail if actual save data does not match its declared format
	if (!validateSave(save, inputSaveVersion))
		throw new SaveFormatError(
			"Save format does not match specified save version: save data is unusable."
		);

	// If the save is already at the latest format, return it as is
	if (inputSaveVersion === SaveVersion.Latest) return save;

	// Otherwise, convert it to the latest version
	const pipeline = buildConversionPipeline(inputSaveVersion);
	return pipeline(save);
}
