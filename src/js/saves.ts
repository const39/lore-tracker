import legacy from "@/schemas/save_format_legacy.json";
import v1 from "@/schemas/save_format_v1.json";
import Ajv from "ajv";
import { SaveFormat } from "./types";

export enum SaveVersion {
	Legacy 	= "save-legacy",
	v1 		= "save-v1",
	Latest 	= "save-v1",
}

const converters = {
	legacyToV1(input: any): any {
		// Convert root object:
		// - Add '_meta' property
		// - Add 'quickNote' property
		// - Keep previous fields
		const converted = {
			_meta: {
				version: SaveVersion.v1,
				lastUpdate: new Date().toISOString(),
			},
			name: input.name,
			days: input.days,
			season: input.season,
			cards: {} as any,
			quickNote: "",
		};

		// Convert cards:
		// - Transform Objectives to Quests
		// - Use category constant as field name (i.e. remove plural on card fields)
		// - Add corresponding '_category' field on each card
		// - Add new Faction category
		converted.cards.quest = input.cards.objectives.map((entry: any) => {
			return {
				_category: "quest",
				id: entry.id,
				tags: entry.tags,
				title: entry.desc,
				tasks: [],
			};
		});

		converted.cards.event = input.cards.events.map((entry: any) => ({
			_category: "event",
			...entry,
		}));
		converted.cards.location = input.cards.locations.map((entry: any) => ({
			_category: "location",
			...entry,
		}));
		converted.cards.character = input.cards.characters.map((entry: any) => ({
			_category: "character",
			...entry,
		}));
		converted.cards.note = input.cards.notes.map((entry: any) => ({
			_category: "note",
			...entry,
		}));
		converted.cards.faction = [];

		return converted;
	},
};

const ajv = new Ajv().addSchema(legacy, SaveVersion.Legacy).addSchema(v1, SaveVersion.v1);

export default {
	/**
	 * Validate data from a save file against a JSON schema corresponding to the specified save format.
	 * @param save the save data to validate
	 * @param format the save format descriptor. Describes the schema against which data will be validated. Will throw an error if format does not describe a registered schema.
	 * @returns a boolean indicating if the data validates against the specified save format.
	 */
	validate(save: SaveFormat | object, format: SaveVersion) {
		return ajv.validate(format, save);
	},
	/**
	 * Convert save data to the latest format. If the save is already at the latest version, it is returned as is.
	 * This method throws an error if the format of the specified save cannot be identified and as such cannot be converted.
	 * 
	 * @param save the save data to convert
	 * @returns the save data, converted if necessary to the latest save format.
	 */
	convertToLatest(save: any) {
		const saveVersion = (save?._meta?.version as SaveVersion) ?? SaveVersion.Legacy;

		if (Object.values(SaveVersion).includes(saveVersion) && this.validate(save, saveVersion)) {
			switch (saveVersion) {
				// * legacy -> v1
				case SaveVersion.Legacy:
					return converters.legacyToV1(save);
				// * No conversion - already latest save version
				case SaveVersion.v1:
				case SaveVersion.Latest:
					return save;
			}
		}

		throw new Error("Save format could not be identified: save data is unusable.");
	},
};
