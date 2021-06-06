let testData = {
	objectives: [
		{
			id: 0,
			order: 0,
			desc: "Retrouver Zyrlat.",
			location: 0,
			characters: [0, 1],
		},
		{
			id: 1,
			order: 1,
			desc: "Retrouver Zyrlat.",
			location: 0,
			characters: [0, 1],
		},
	],
	events: [
		{
			id: 0,
			order: 0,
			desc: "Une grande bataille",
			location: 0,
			characters: [0, 1],
			type: "Combat",
		},
		{
			id: 1,
			order: 1,
			desc: "Une grande bataille",
			location: 0,
			characters: [0, 1],
			type: "Combat",
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
	],
	characters: [
		{
			id: 0,
			order: 0,
			name: "Acménos",
			race: "Tiefflin",
			class: "Roublard",
			role: "Marchand",
			isNPC: false,
			desc: "A rencontré Halvor dans une taverne.",
		},
		{
			id: 1,
			order: 1,
			name: "Halvor",
			race: "Humain",
			class: "Guerrier",
			role: "Mercenaire",
			isNPC: false,
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
			title: "Lorem ispum.",
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

console.log(db.data);

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
	testData,
	data: db.data,
	addLocation,
};
