/* eslint-disable @typescript-eslint/no-explicit-any */
import schemaLegacy from "@/schemas/save_format_legacy.json";
import schemaV1 from "@/schemas/save_format_v1.json";
import schemaV2 from "@/schemas/save_format_v2.json";
import Ajv from "ajv";
import { FileTree, SaveFormat, SerializableState, State } from "./types";
import utilities from "./utilities";

export enum SaveVersion {
	Legacy = "save-legacy",
	v1 = "save-v1",
	v2 = "save-v2",
	Latest = "save-v2",
}

const validator = new Ajv()
	.addSchema(schemaLegacy, SaveVersion.Legacy)
	.addSchema(schemaV1, SaveVersion.v1)
	.addSchema(schemaV2, SaveVersion.v2);

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
	 * - New field: 'notepad' on root object
	 *
	 * @param save data to convert to v2 format
	 * @returns input data converted to v2 format
	 */
	protected convert(save: any): any {
		const converted: State = utilities.deepCopy(save);
		converted.notepad = new FileTree();
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
	serialize(state: SerializableState): SaveFormat {
		// Clone state to avoid modifying it
		const serialized: any = utilities.deepCopy(state);
		serialized._meta = {
			version: SaveVersion.Latest,
			lastUpdate: new Date().toISOString(),
		};
		serialized.notepad = state.notepad.serialize(); // Serialize Map instance to object literal
		return serialized;
	},
	deserialize(save: SaveFormat): SerializableState {
		// Clone save to avoid modifying it
		const deserialized: any = utilities.deepCopy(save);
		deserialized.notepad = new FileTree(save.notepad); // Deserialize object literal to FileTree instance
		return deserialized;
	},
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
