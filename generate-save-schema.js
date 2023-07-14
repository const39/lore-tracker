import fs from "fs";
import process from "node:process";
import tsj from "ts-json-schema-generator";

const OUTPUT_DIR = "./src/schemas";

function getNextSaveFormatVersion() {
	const input = process.argv[2];
	const match = /v\d+/.test(input);
	if (match) return input;
	else {
		if (!input?.trim()) console.error("ERROR: No save format version specified.");
		else console.error("ERROR: The specified save format version is invalid.");
		process.exit(1);
	}
}

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
	path: "./src/store/index.ts",
	tsconfig: "./tsconfig.schemas.json",
	type: "SaveFormat",
};

const nextVersionNumber = getNextSaveFormatVersion();
const output = `${OUTPUT_DIR}/save_format_${nextVersionNumber}.json`;

console.log("Generating schema...");
const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaJSON = JSON.stringify(schema, null, 2);

console.log(`Writing schema to ${output}...`);
fs.writeFile(output, schemaJSON, (err) => {
	if (err) throw err;
	console.log("Done.");
});
