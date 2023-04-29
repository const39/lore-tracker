export const required = (msg: string) => (v: string) => !!v || msg;

export const counter = (msg: string, count: number) => (v: string) => v.length <= count || msg;

export const number = (msg: string) => (v: string | number) => {
	const val = Number(v);

	let predicate = true;
	if (typeof v === "string") predicate &&= v.trim().length > 0;
	return (predicate && Number.isSafeInteger(val)) || msg;
};

export const numberInRange =
	(msg: string, start: number, stop?: number) => (v: string | number) => {
		const val = Number(v);

		// Assert v is a valid number
		let predicate = number(msg)(v) === true;

		// Assert val is in range
		if (stop !== undefined) predicate &&= val >= start && val < stop;
		else predicate &&= val >= start;

		return predicate || msg;
	};

export const hex = (msg: string) => (v: string) =>
	/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || msg;

export default {
	required,
	counter,
	numberInRange,
	hex,
};
