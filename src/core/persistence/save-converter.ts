/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from "ajv";
import { SaveFormat } from "@/core/persistence/save-manager";
import utilities from "@/core/utils/functions";
import schemaLegacy from "@/schemas/save_format_legacy.json";
import schemaV1 from "@/schemas/save_format_v1.json";
import schemaV2 from "@/schemas/save_format_v2.json";
import schemaV3 from "@/schemas/save_format_v3.json";
import { Category } from "../models";
import { UUID } from "../utils/types";

export enum SaveVersion {
	Legacy = "save-legacy",
	v1 = "save-v1",
	v2 = "save-v2",
	v3 = "save-v3",
	Latest = "save-v3",
}

const validator = new Ajv()
	.addSchema(schemaLegacy, SaveVersion.Legacy)
	.addSchema(schemaV1, SaveVersion.v1)
	.addSchema(schemaV2, SaveVersion.v2)
	.addSchema(schemaV3, SaveVersion.v3);

abstract class SaveProcessor {
	inputSaveVersion: SaveVersion;
	targetSaveVersion: SaveVersion;

	constructor(inputSaveVersion: SaveVersion, targetSaveVersion: SaveVersion) {
		this.inputSaveVersion = inputSaveVersion;
		this.targetSaveVersion = targetSaveVersion;
	}

	/**
	 * Validate data from a save file against a JSON schema corresponding to the specified save format.
	 * @param save the save data to validate
	 * @param format the save format descriptor. Describes the schema against which data will be validated. Will throw an error if format does not describe a registered schema.
	 * @returns a boolean indicating if the data validates against the specified save format.
	 */
	static validate(save: SaveFormat | object, format: SaveVersion) {
		const isValid = validator.validate(format, save);
		if (!isValid && process.env.NODE_ENV !== "production") console.error(validator.errors);
		return isValid;
	}

	validateAndConvert(save: any): any {
		if (SaveProcessor.validate(save, this.inputSaveVersion)) return this.convert(save);
		else
			throw new Error(
				"Save format does not match specified save version: save data is unusable."
			);
	}

	protected abstract convert(save: any): any;
}

class V1SaveProcessor extends SaveProcessor {
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
	protected convert(save: any): any {
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

class V2SaveProcessor extends SaveProcessor {
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
	protected convert(save: any): any {
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

class V3SaveProcessor extends SaveProcessor {
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
	 * - Convert all numeric IDs to string UUIDs
	 *
	 * @param save data to convert to v3 format
	 * @returns input data converted to v3 format
	 */
	protected convert(save: any): SaveFormat {
		const converted = this.convertToORMFormat(this.convertFieldsAndIDs(save));

		// Update save version
		converted._meta.version = SaveVersion.v3;

		return converted;
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
			Object.keys(rootFolder).forEach((folderHash, idx) => {
				const folder = rootFolder[folderHash];
				folder.metadata.tags = []; // [1]
				folder.metadata.position = idx; // [2]
				folder.metadata.category = folder.metadata._category; // [3]
				delete folder.metadata._category; // [3]
				folder.metadata.id = this.convertID(folder.metadata.id); // [4]

				folder.files.forEach((file: any, i: number) => {
					file.id = this.convertID(file.id); // [4]
					file.category = file._category; // [3]
					delete file._category; // [3]
					file.position = i; // [2]
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
		// Group all cards in the same object
		const loreEntries: Record<string, any> = {};
		Object.keys(save.cards).forEach((category) => {
			const rootFolder = save.cards[category];
			Object.keys(rootFolder).forEach((folderHash) => {
				// Add the 'folderId' foreign key to every file of this folder
				// and add the card with the others
				const folderId = rootFolder[folderHash].metadata.id;
				rootFolder[folderHash].files.forEach((file: any) => {
					loreEntries[file.id] = { ...file, folderId };
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
				};
			});
		});

		const campaign = {
			id: utilities.uuid(),
			name: save.name,
			days: save.days,
			season: save.season,
			quickNote: save.quickNote,
		};
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

function getProcessorFromInputVersion(inputSaveVersion: SaveVersion): SaveProcessor | undefined {
	switch (inputSaveVersion) {
		case SaveVersion.Legacy:
			return new V1SaveProcessor();
		case SaveVersion.v1:
			return new V2SaveProcessor();
		case SaveVersion.v2:
			return new V3SaveProcessor();
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
			toPipe.push((arg: any) => proc.validateAndConvert(arg));
		} else break;
	}

	return utilities.pipe(...toPipe);
}

export default {
	/**
	 * Convert save data to the latest format. If the save is already at the latest version, it is returned as is.
	 * This method throws an error if the format of the specified save cannot be identified and as such cannot be converted.
	 *
	 * @param save the save data to convert
	 * @returns the save data, converted if necessary to the latest save format.
	 */
	ensureLatestVersion(save: any): SaveFormat {
		const inputSaveVersion = (save?._meta?.version as SaveVersion) ?? SaveVersion.Legacy;
		if (Object.values(SaveVersion).includes(inputSaveVersion)) {
			const pipeline = buildConversionPipeline(inputSaveVersion);
			const saveAtLatestFormat: SaveFormat = pipeline(save);
			return saveAtLatestFormat;
		} else throw new Error("Save format could not be identified: save data is unusable.");
	},
};
