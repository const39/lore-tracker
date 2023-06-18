import fs from "fs";
import tsj from "ts-json-schema-generator";

const OUTPUT_DIR = "./src/schemas";

function getNextSaveFormatVersion() {
	const lastFile = fs.readdirSync(OUTPUT_DIR).sort().slice(-1)[0];
	const lastFileVersionNumber = lastFile.match(/\d/g)[0];
	return Number(lastFileVersionNumber) + 1;
}

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
	path: "./src/store/index.ts",
	tsconfig: "./tsconfig.schemas.json",
	type: "SaveFormat",
};

const nextVersionNumber = getNextSaveFormatVersion();
const output = `${OUTPUT_DIR}/save_format_v${nextVersionNumber}.json`;

console.log("Generating schema...");
const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaJSON = JSON.stringify(schema, null, 2);

console.log(`Writing schema to ${output}...`);
fs.writeFile(output, schemaJSON, (err) => {
	if (err) throw err;
	console.log("Done.");
});
