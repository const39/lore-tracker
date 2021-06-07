let testData = {
	objectives: [
		{
			id: 0,
			order: 0,
			desc: "Retrouver Zyrlat.",
			locationId: 0,
			charactersIds: [0, 1],
		},
		{
			id: 1,
			order: 1,
			desc: "Retrouver Zyrlat.",
			locationId: undefined,
			charactersIds: [0, 1],
		},
		{
			id: 2,
			order: 2,
			desc: "Retrouver Zyrlat.",
			locationId: 1,
			charactersIds: [],
		},
		{
			id: 3,
			order: 3,
			desc: "Retrouver Zyrlat.",
			locationId: undefined,
			charactersIds: undefined, // limite
		},
	],
	events: [
		{
			id: 0,
			order: 0,
			desc: "Une grande bataille",
			locationId: 0,
			charactersIds: [0, 1],
			type: "Combat",
		},
		{
			id: 1,
			order: 1,
			desc: "Une grande découverte",
			locationId: undefined,
			charactersIds: [0, 1],
			type: "Discovery",
		},
		{
			id: 2,
			order: 2,
			desc: "Une grande découverte",
			locationId: 0,
			charactersIds: [],
			type: "Discovery",
		},
		{
			id: 3,
			order: 3,
			desc: "Une grande découverte",
			locationId: undefined,
			charactersIds: [],
			type: "", // limite
		},
	],
	locations: [
		{
			id: 0,
			order: 0,
			name: "Langdale",
			desc:
				"Un petit village perdu dans une plaine. Une taverne, L'Auberge Noire, s'y trouve. Le village a connu une bataille lorsque...",
		},
		{
			id: 1,
			order: 1,
			name: "Langdale",
			desc:
				"Un petit village perdu dans une plaine. Une taverne, L'Auberge Noire, s'y trouve. Le village a connu une bataille lorsque...",
		},
		{
			id: 2,
			order: 2,
			name: "Langdale",
			desc: undefined
		},
	],
	characters: [
		{
			id: 0,
			order: 0,
			name: "Acménos",
			race: "Tiefflin",
			classes: "Roublard",
			role: "Marchand",
			isNPC: false,
			desc: "A rencontré Halvor dans une taverne.",
		},
		{
			id: 1,
			order: 1,
			name: "Halvor",
			race: "Humain",
			classes: "Guerrier",
			role: "Mercenaire",
			isNPC: false,
			desc: "A rencontré Acménos dans une taverne.",
		},
		{
			id: 2,
			order: 2,
			name: "Alix",
			race: undefined,
			classes: undefined,
			role: undefined,
			isNPC: true,
			desc: "A rencontré Acménos dans une taverne.",
		},
	],
	notes: [
		{
			id: 0,
			order: 0,
			title: "Lorem ispum.",
			desc: "Lorem ispum...",
		},
		{
			id: 1,
			order: 1,
			title: undefined,
			desc: "Lorem ispum...",
		},
	],
};

import { LowSync, JSONFileSync } from "lowdb";

const SAVE_DIR = "./saves/";
const SAVE_FILE = SAVE_DIR + "save.json";

const db = new LowSync(new JSONFileSync(SAVE_FILE));
db.read(); // Reads file to init db.data (null if file doesn't exist)

// If data is null, init with default empty object
db.data ||= {
	objectives: [],
	events: [],
	locations: [],
	characters: [],
	notes: [],
};

// DEBUG
db.data = testData
// DEBUG

let orders = {
	objectives: 0,
	events: 0,
	locations: 0,
	characters: 0,
	notes: 0,
}

for (const key in db.data) {
	db.data[key].forEach(elem => {
		orders[key] = Math.max(orders[key], elem.order);
	});
}

function uid() {
	return new Date().getTime();
}

function addLocation(name, desc) {

	if(name) {
		db.data.locations.push({
			id: uid(),
			order: orders.locations++,
			name: name,
			desc: desc
		});
		db.write();
	}
}

export default {
	// testData,
	data: db.data,
	addLocation,
};